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
        	controller: NCP.app.GridCtrl
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
						self.preview(img);
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

		preview: function(img){
			var settings = this.getPreviewSettings(img.width, img.height)
			  , left = settings.targetLeft
			  , top = settings.targetTop
			  , width = settings.width
			  , height = settings.height
			  , ctx = this.canvas.getContext('2d');

			ctx.drawImage(img, left, top, width, height);
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
		}
	});

	/* Depencies */
	var directive = [
		'$log',
		'$timeout',
		'$http'
	];

	directive.push(function($log, $timeout, $http){
		var fileUploadManager = null
		  , successEventName = 'onSuccessUpload'
		  , serviceUrl = '/api/medias/add';

		var ctrl = ['$scope', function($scope){
			$scope.upload = function(){
				var data = fileUploadManager.getData();
				if(data){
					$http.post(serviceUrl, {file: data}).success(function(data, status){
						$scope.$emit(successEventName);
					}).error(function(data, status){
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
			link: function($scope, elem, attrs){
				/* Elements not listed in the grid */
				var elts = [];
				for(var i = 0; i < 10; i++)
					elts.push('image-added-' + i + '.jpg');
				$scope.elements = elts;
				
				var event = attrs.ncpMediasGrid;
				/* Listener for last frame repeat iteration */
				$scope.$on(event, function(e){
					$timeout(function(){
						var grid = Grid.configure({}).run();
						if(grid.length()){
							var options = {
								delay: 7*1000
							};
							
							var dispatcher = new Dispatcher(grid.getData(), $scope.elements, options);
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
		'$log'
	];

	/**
	 * @desc Ctrl
	*/
	ctrl.push(function($scope, $log) {
		var items = [];
		for(i = 0, l = 15; i < l; i++)
			items.push(i);
			
		$scope.items = items;
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