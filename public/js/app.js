$('document').ready(function(){
	/* Test Socket IO Only on default url / */
	var path = window.location.pathname;
	if(path == '/'){
		var socket = io();
		socket.on('new media', function(data){
			console.log('Socket - main.js : ' + JSON.stringify(data));
		});

		socket.on('delete media', function(data){
			console.log(data);
		});
	}
	
	try {
		var g = Grid.configure({}).run();
	} catch(e){
		console.log(e);
	}
});
/**
 * @desc Global namespace Videotron Espace Client App
*/
var NCP = NCP || {};

/**
 * Define Angular App with dependencies
*/
var dependencies = [
	'ngRoute',
    'ngAnimate',
    'ngTouch',
    'pascalprecht.translate',
    'ngLocale',
    'ngSanitize'
];

NCP.app = NCP.app || angular.module('NCP.app', dependencies);

var constants = {
    'BASE_ROUTE': '/', //URL
    'ROOT_PATH': '/',
    'IMG_PATH': '/img',
    'VIEWS_PATH': '/views',
    'LANGUAGE_PATH': '/languages/'
}

/**
 * Define PATH Contants
*/
NCP.app.constant('PATH', constants);

NCP.app.config([
    '$routeProvider',
    '$locationProvider',
    'PATH',
    function($routeProvider, $locationProvider, PATH){
        /**
         * Routing & Url history for one pager application
        */
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         * Routing with controllers
        */
        $routeProvider.when('/grid',{ //Image Grid
        	templateUrl: PATH.VIEWS_PATH + '/grid.html',
        	controller: NCP.app.GridCtrl,
            resolve: {
                'Medias': ['MediasService', function(MediasService){
                    return MediasService.get();
                }]
            }
        }).when('/list',{ //Image List for Delete actions
        	templateUrl: PATH.VIEWS_PATH + '/list.html',
        	controller: NCP.app.ListCtrl
        }).otherwise({ //Default route upload first step
        	templateUrl: PATH.VIEWS_PATH + '/index.html',
        	controller: NCP.app.MainCtrl
        });
    }
]).run(['$log', function($log){
 	$log.info('Application running...');
}]);
(function(ng, NCP) {
	/**
	 * @desc Ctrl dependencies
	*/
	var service = [
		'$http',
		'$q',
		'$log'
	];

	/**
	 * @desc Ctrl
	*/
	service.push(function($http, $q, $log) {
		var apiUrl = '/api';
		
		return {
			get: function(){
				var url = apiUrl + '/medias/list'
				  , deferred = $q.defer();

				$http.get(url).then(function(r, status){
					var d = r.data;
					if(d.success){
						deferred.resolve(d.data);
					} else deferred.reject();
				}, function(error, status){
					deferred.reject();
				});

				return deferred.promise;
			},

			create: function(p_mediaData){
				var url = apiUrl + '/medias/add'
				  , params = {file: p_mediaData}
				  , deferred = $q.defer();

				$http.post(url, params).then(function(data, status){
					deferred.resolve(data);
				}, function(data, status){
					deferred.reject();
				});

				return deferred.promise;
			},

			delete: function(p_mediaId){
				var url = apiUrl + '/medias/delete'
				  , params = {id: p_mediaId}
				  , deferred = $q.defer();

				$http.post(url, params).then(function(data, status){
					deferred.resolve(data);
				}, function(error, status){
					deferred.reject();
				});

				return deferred.promise;
			}
		}
	});

	/**
	 * @desc
	*/
	NCP.app.factory('MediasService', service);
})(angular, NCP);
(function(ng, NCP){
	/**
	 * File Uploader Manager Class
	*/
	var FileUploadManager = function(container, opts){
		this.options = $.extend({}, {
			url: null,
			size: 300
		}, opts);

		this.container = $(container);
		this.form = $('form', this.container);
		this.file = $('input[type="file"]');
		this.reader = new FileReader();
		this.canvas = $('canvas', this.container)[0] || null;
		this.rotation = 0;
		this.data = null;
		if(!this.canvas){
			throw new Error('A canvas HTML element is required to FileUploadManager instance works well !');
		}

		return this.init();
	};

	$.extend(FileUploadManager.prototype, {
		init: function(){
			var canvas = this.canvas
			  , ctx = this.canvas.getContext('2d')
			  , self = this;

			this.file.bind('change', function(evt){
				/* Input type file */
				var target = evt.target;

				/* Listener for file reader */
				self.reader.onload = function(e){
					var src = e.target.result
					  , img = new Image();

					/* Image loading preview */
					img.onload = function(){
						self.preview(img, 90);
					};

					/* Load image data */
					img.src = src;
				};

				/* Read information in target input type file */
				self.reader.readAsDataURL(target.files[0]);
			});

			return this;
		},

		getData: function(){
			var data = null;
			if(this.canvas){
				data = this.canvas.toDataURL();
			}

			return data;
		},

		preview: function(img, rotation){
			var settings = this.getPreviewSettings(img.width, img.height)
			  , left = settings.targetLeft
			  , top = settings.targetTop
			  , width = settings.width
			  , height = settings.height
			  , size = width
			  , ctx = this.canvas.getContext('2d')
			  , rotation = rotation || 0;

			/* Rotate */
			ctx.drawImage(img, left, top, width, height);
			/* Set data */
			this.data = this.canvas.toDataURL();

			return this;
		},

		getPreviewSettings: function(srcWidth, srcHeight){
			var targetWidth = this.options.size
			  , targetHeight = this.options.size
			  , width = targetWidth
			  , height = targetHeight;

		    /* Scale to the target width */
		    var scaleX1 = targetWidth
		      , scaleY1 = (srcHeight * targetWidth)/srcWidth;

		    /* Scale to the target height */
		    var scaleX2 = (srcWidth * targetHeight)/srcHeight
		      , scaleY2 = targetHeight;

    		/* Now figure out which one we should use */
    		if(scaleX2 > targetWidth){
    			/* Landscape image */
    			width = Math.floor(scaleX2);
		    } else {
		    	height = Math.floor(scaleY1);
		    }

		    var result = {
				width: width,
				height: height,
				targetLeft: Math.floor((targetWidth - width)/2),
				targetTop: Math.floor((targetHeight - height)/2)
			};

    		return result;
		},

		reset: function(){
			/* Reset the form. */
			this.form[0].reset();
			/* Clear canvas */
			var ctx = this.canvas.getContext('2d')
			  , size = this.options.size;
			ctx.clearRect (0, 0, size, size);

			return this;
		},

		rotate: function(){
			var img = new Image()
			  , src = this.data
			  , ctx = this.canvas.getContext('2d')
			  , size = this.options.size
			  , center = size/2;

			this.rotation = (this.rotation != 270)? this.rotation+90 : 0;

			if(src.length){
				img.src = src;
				ctx.save();
				ctx.clearRect (0, 0, size, size);
				ctx.translate(center, center);
				ctx.rotate(this.rotation*Math.PI/180);
				ctx.drawImage(img, -1*center, -1*center, size, size);
				ctx.restore();
			}

			return this;
		}
	});

	/* Depencies */
	var directive = [
		'$log',
		'$timeout',
		'MediasService'
	];

	directive.push(function($log, $timeout, MediasService){
		var fileUploadManager = null
		  , successEventName = 'onSuccessUpload'
		  , serviceUrl = '/api/medias/add';

		var ctrl = ['$scope', function($scope){
			$scope.upload = function(){
				var data = fileUploadManager.getData();
				if(data){
					MediasService.create(data).then(function(data, status){
						$scope.$emit(successEventName);
					}, function(data, status){
						alert('Serveur error !!!!');
					});
				} else {
					alert('Error !!!!');
				}
			};

			/* Reset form && restart upload process */
			$scope.reset = function(){
				fileUploadManager.reset();
			};

			$scope.rotation = function(){
				fileUploadManager.rotate();
			};
		}];

		return {
			restrict: 'E',
			controller: ctrl,
			link: function($scope, elem, attrs){
				var $form = $('form', elem);
				if($form.length){
					/* Instance of FileUploadManager Class */
					fileUploadManager = new FileUploadManager(elem, {});
					/* Fake feed back */
					$scope.$on(successEventName, function(){
						var $c = $('.step-3 p', elem).css({background: 'green'});
						$timeout(function(){
							$c.css({background: 'none'});
							fileUploadManager.reset();
						}, 1000, false);
					});
				}
			}
		}
	});

	NCP.app.directive('ncpFileUpload', directive);
})(angular, NCP);
(function(ng, NCP){
	var directive = [
		'$log',
		'$timeout'
	];
	
	directive.push(function($log, $timeout){
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function($scope, elem, attrs, ngModel){
				var eventName = attrs.ncpMediasGrid;
				/* Listener for last frame repeat iteration */
				$scope.$on(eventName, function(e){
					$timeout(function(){
						var grid = Grid.configure({}).run()
						  , elements = ngModel.$viewValue;

						if(grid.length()){
							var options = {
								delay: 7*1000
							};

							var dispatcher = new Dispatcher(grid.getData(), elements, options);
							$(dispatcher).bind('Dispatcher::picked', function(evt, data){
								/* Make transition in grid */
								grid.framelize(data);
								/* Update excluded elements */
								dispatcher.setExcluded(grid.getData());
							});
							
							/* Socket instance */
							var socket = io();
							/* Socket Listener */
							socket.on('new media', function(data){
								dispatcher.push(data.url);
							});
						}
					});		
				});
			}
		}
	});

	NCP.app.directive('ncpMediasGrid', directive);
})(angular, NCP);
(function(ng, NCP){
	var directive = [
		'$log',
		'$timeout'
	];

	directive.push(function($log, $timeout){
		return {
			restrict: 'A',
			link: function($scope, elem, attrs){
				var event = attrs.ncpRepeatLast;
				if($scope.$last){
					$scope.$emit(attrs.ncpRepeatLast, []);
				}
			}
		}
	});

	NCP.app.directive('ncpRepeatLast', directive);
})(angular, NCP);
(function(ng, NCP) {
	/**
	 * @desc Ctrl dependencies
	*/
	var ctrl = [
		'$scope',
		'$log',
		'Medias'
	];

	/**
	 * @desc Ctrl
	*/
	ctrl.push(function($scope, $log, Medias) {
		var length = 5
		  , grid = []
		  , items = []
		  , limit = (Medias.length >= length)? length : Medias.length;

		/* Items for Grid */
		for(var i = 0; i < limit; i++){
			var item = Medias[i];
			grid.push(item.file.url);
		}

		/* Elements to add in grid after load */
		if(Medias.length > limit){
			var limit = Medias.length;
			for(; i < limit; i++){
				var item = Medias[i];
				items.push(item.file.url);
			}
		}

		$scope.data = {
			grid: grid,
			items: items
		};
	});

	/**
	 * @desc
	*/
    NCP.app.GridCtrl = ctrl;
})(angular, NCP);
(function(ng, NCP) {
	/**
	 * @desc Ctrl dependencies
	*/
	var ctrl = [
		'$scope',
		'$log'
	];

	/**
	 * @desc Ctrl
	*/
	ctrl.push(function($scope, $log) {
		$log.info('ListCtrl');
	});

	/**
	 * @desc
	*/
    NCP.app.ListCtrl = ctrl;
})(angular, NCP);
(function(ng, NCP) {
	/**
	 * @desc Ctrl dependencies
	*/
	var ctrl = [
		'$scope',
		'$log'
	];

	/**
	 * @desc Ctrl
	*/
	ctrl.push(function($scope, $log) {
		$log.info('MainCtrl');
	});

	/**
	 * @desc
	*/
    NCP.app.MainCtrl = ctrl;
})(angular, NCP);