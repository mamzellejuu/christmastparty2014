
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
    'ngSanitize',
    'angularUtils.directives.dirPagination'
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
    'paginationTemplateProvider',
    'PATH',
    function($routeProvider, $locationProvider, paginationTemplateProvider, PATH){
        /**
         * Config provider pagination module 
        */
        paginationTemplateProvider.setPath(PATH.VIEWS_PATH + '/partials/pagination.html');

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
        	controller: NCP.app.ListCtrl,
            resolve: {
                Medias: ['MediasService', function(MediasService){
                    return MediasService.get(500);
                }]
            }
        }).when('/upload',{ //Upload in batch actions
            templateUrl: PATH.VIEWS_PATH + '/upload.html',
            controller: NCP.app.UploadCtrl
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
			get: function(limit){
				var limit = limit || 100
				  , url = apiUrl + '/medias/list/' + limit
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
	/***/
	var Grid = (function(){
		var n = 20
		  , m = 5
		  , l = 3
		  , limit = n + m + l;

		/**
		* @desc Base Grid Structure
		*/
		var structure = {
	  		normal: {
	  			data: [],
	  			length: n
	  		},
	  		medium: {
	  			data: [],
	  			length: m
	  		},
	  		large: {
	  			data: [],
	  			length: l
	  		}
	  	};

	  	var _grid = []
	  	  , _items = [];

		return {
			/***/
			get: function(data){
				var r = ng.copy(structure)
				  , j = 0;

				/* Build structure */
				for(var p in r){
					var limit = r[p].length;
					for(var i = 0; i < limit; i++, j++){
						var f = data[j] || '';
						r[p].data.push(f);
					}
				}

				return r;
			},

			length: function(){
				return limit; 
			},

			items: function(){
				return _items;
			},

			grid: function(){
				return _grid;
			}
		}
	})();

	NCP.app.factory('GridModel', [function(){
		return {
			init: function(medias){
				/* Items for Grid */
				var length = Grid.length()
				  , mediasLength = medias.length
				  , __grid = []
				  , __items = []
		  		  , limit = (mediasLength >= length)? length : mediasLength;

				for(var i = 0; i < limit; i++){
					var item = medias[i];
					__grid.push({url: item.file.url});
				}
				/* Set Grid */
				_grid = __grid;

				/* Elements to add in grid after load */
				if(mediasLength > limit){
					var limit = mediasLength;
					for(; i < limit; i++){
						var item = medias[i];
						__items.push({url: item.file.url});
					}
				}
				/* Set Items */
				_items = __items;

				return true;
			},
			grid: function(){
				return _grid;
			},
			items: function(){
				return _items;
			},
			get: function(){
				return Grid.get(_grid);
			}
		}
	}]);
})(angular, NCP);
(function(ng, NCP){
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
			var process = false;
			$scope.upload = function(){
				var data = fileUploadManager.getData();
				if(data && !process){
					/* DOM manipulation */
					$scope.$emit('startUpload');
					/* Start request */
					process = true;
					/* Service Call*/
					MediasService.create(data).then(function(data, status){
						$scope.$emit(successEventName);
						process = false;
					}, function(data, status){
						alert('Oups... il semble que ce soit FG. qui soit le developpeur de cette chose !!!! Désolé... venez me voir pour me remercier quand même !');
						process = false;
					});
				} else {
					alert('Oups... ça nous prend un fichier image et beaucoup de patience... recommence on ne sait jamais !!!!');
				}
			};

			/* Reset form && restart upload process */
			$scope.reset = function(){
				fileUploadManager.reset();
			};

			$scope.restart = function(){
				$scope.$emit('restart');
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
					/* DOM elements */
					var $trio = $('#trio', elem)
					  , $dos = $('#dos', elem)
					  , $one = $('#one', elem)
					  , $logo = $('#logo', elem)
					  , $okLarge = $('#oklarge', elem)
					  , $replayImg = $('#replay img', elem);


					/* Instance of FileUploadManager Class */
					fileUploadManager = new FileUploadManager(elem, {}).init();

					/* On preview */
					$(fileUploadManager).bind('previewFileUpload', function(){
						$logo.fadeOut();
						$dos.fadeIn('slow');
		    			$one.fadeOut();
					}).bind('previewStartLoad', function(){
						$form.addClass('bling');
					}).bind('previewLoaded', function(){
						$form.removeClass('bling');
					});

					/* Fake feed back */
					$scope.$on(successEventName, function(){
						$trio.fadeIn('fast');
						$dos.fadeOut();
						$timeout(function(){
							$logo.fadeIn();
							$timeout(function(){
								$okLarge.addClass('active');
							}, 60, false);
							
							$replayImg.addClass('active');
							fileUploadManager.reset();
						}, 60, false);
					});

					$scope.$on('startUpload', function(){
						// Jouer dans le DOM quand y'a succès!
						$dos.animate({opacity: 0.3});
					});

					$scope.$on('restart', function(){
						$okLarge.removeClass('active');
						$replayImg.removeClass('active');
						$one.fadeIn();
						$trio.fadeOut();
						$dos.css({opacity: 1});
					});
				}
			}
		}
	});

	NCP.app.directive('ncpFileUpload', directive);
})(angular, NCP);
(function(ng, NCP){

	/* Controller */
	var ctrl = [
		'$scope',
		'$log',
		'$timeout',
		'MediasService',
		'GridModel'
	];

	ctrl.push(function($scope, $log, $timeout, MediasService, GridModel){
		$scope.init = function(beforeStart){
			/* Action to do before init page */
			if(beforeStart){
				beforeStart.call(null);
			}

			MediasService.get(30).then(function(data){
				GridModel.init(data);
				/* Create data structure */
				var data = {
					grid: GridModel.grid(),
					items: GridModel.items(),
					structure: GridModel.get()
				};

				/* Data in scope */
				$timeout(function(){
					$scope.data = data;
				}, 0, true);
			}, function(){
				$log.error('Error loading data...');
			});
		};
		
		$scope.refresh = function(){
			$scope.init();
		};
	});

	/**
	 * @desc Directive Grid
	*/
	var directive = [
		'$log',
		'$timeout'
	];
	
	directive.push(function($log, $timeout){
		return {
			restrict: 'A',
			controller: ctrl,
			link: function($scope, elem, attrs){
				var eventName = attrs.ncpMediasGrid
				  , isotope = null
				  , delay = 30*1000
				  , interval = null
				  , dispatcher = null
				  , $parent = $(elem.parents('.grid-wrapper:first'));

				/* Listener for last frame repeat iteration */
				$scope.$on(eventName, function(e){
					$timeout(function(){
						var grid = Grid.configure({}).run()
						  , elements = $scope.data.items;

						if(isotope){
							/* Destroy instance */
							elem.isotope('destroy');
						}

						isotope = elem.isotope({
						  itemSelector: '.item',
						  masonry: {
						  	gutter: 30,
						  	columnWidth: 162
						  }
						});

						/* Auto Run Isotope */
						if(interval){
							window.clearInterval(interval);
							interval = null;
						}

						/* Run interval random Grid */
						interval = window.setInterval(function(){
							elem.isotope('shuffle');
						}, delay);

						/* Shuffle the grid @t loading */
						$timeout(function(){
							elem.isotope('shuffle');
						}, 100, false);

						if(grid.length()){
							var options = {
								delay: 5*1000
							};

							if(dispatcher){
								dispatcher.destroy();
							}

							var els = [];
							for(var i = 0, l = elements.length; i < l; i++){
								els.push(elements[i].url);
							}

							dispatcher = new Dispatcher(grid.getData(), els, options);
							$(dispatcher).bind('Dispatcher::picked', function(evt, data){
								/* Make transition in grid */
								grid.framelize(data, true);

								/* Update excluded elements */
								dispatcher.setExcluded(grid.getData());
							});
							
							/* Socket instance */
							var socket = io();
							/* Socket Listener */
							socket.on('new media', function(data){
								dispatcher.push(data.url);
							});

							socket.on('del media', function(){
								window.location.reload();
							});

							$parent.removeClass('loading');
						}
					});		
				});

				$scope.init();
			}
		}
	});

	NCP.app.directive('ncpMediasGrid', directive);
})(angular, NCP);
(function(ng, NCP){
	var directive = [
		'$log',
		'$timeout',
		'$location'
	];

	var load = false;

	directive.push(function($log, $timeout, $location){
		return {
			restrict: 'A',
			link: function($scope, elem, attrs){
				var path = $location.path()
				  , name = 'main';

				switch(path){
					case '/grid':
						name = 'main-grid';
					break;
					case '/list':
						name = 'main-list';
					break;
					case '/upload':
						name = 'main-list';
					break;
				}

				elem.addClass(name);
			}
		}
	});

	NCP.app.directive('ncpContextClass', directive);
})(angular, NCP);
(function(ng, NCP){
	var directive = [
		'$log',
		'$timeout',
		'MediasService'
	];

	directive.push(function($log, $timeout, MediasService){
		return {
			restrict: 'A',
			link: function($scope, elem, attrs){
				var $form = $('form', elem)
				  , $file = $('input[type="file"]', $form);

				$file.bind('change', function(evt){
					/* Input type file */
					var target = evt.target
					  , files = target.files
					  , l = files.length
					  , items = []
					  , j = 0;

					for(var i = 0; i < l; i++){
						(function(file){
							/* File reader */
							var reader = new FileReader();
							/* Load */
							reader.onload = function(event){
								items.push({url: event.target.result});
								j++;

								if(j == l){
									$timeout(function(){
										$scope.items = items;
									}, 0, true);
								}
							};
							/* Read file */
							reader.readAsDataURL(file);
						})(files[i]);	
					}
				});

				$timeout(function(){
					$scope.items = [];
				}, 0, true);

				var upload = function(t, index){
					var l = t.length
					  , i = index || 0
					  , $item = $('.item[data-index=' + i + ']');

					if(l){
						var url = t[i].url
						  , fileViewer = new FileUploadViewer($item, {url: url}).init()
						  , img = $('img', $item)[0];

						$(fileViewer).bind('previewFileUpload', function(){
							var data = fileViewer.data;
							if(data){
								var cb = function(){
									$item.fadeOut(1000, function(){
										$item.remove();
										i++;
										if(i<l){
											$timeout(function(){
												upload(t, i);
											}, 500);
										}
									});
								};

								/* Service Call*/
								MediasService.create(data).then(function(data, status){
									cb();
								}, function(data, status){
									alert('Oups... il semble que ce soit FG. qui soit le developpeur de cette chose !!!! Désolé... venez me voir pour me remercier quand même !');
									cb();
								});
							}
						});

						fileViewer.preview(img);
					}
				};

				$scope.upload = function(){
					upload($scope.items);
				};

				$(document).delegate('.item', 'click', function(e){
					var $target = $(e.target)
					  , $parent = $target.parents('.item:first');

					if($parent.length){
						$parent.fadeOut(500, function(){
							$parent.remove();
						});
					}
				});
			}
		}
	});

	NCP.app.directive('ncpMultiFileUpload', directive);
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
		'$log',
		'Medias',
		'MediasService'
	];

	/**
	 * @desc Ctrl
	*/
	ctrl.push(function($scope, $log, Medias, MediasService) {
		/**
		 * List items
		*/
		$scope.data = Medias;

		/**
		 * Delete item in list
		*/
		$scope.delete = function(objectId){
			if(window.confirm('Voulez-vous supprimer l\'image : ' + objectId)){
				MediasService.delete(objectId).then(function(){
					window.location.reload();
				}, function(){
					alert('Une erreur s\'est produite. Veuillez supprimer l\'image directement dans base de données.');
				});
			}
		};
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
	ctrl.push(function($scope, $log){});

	/**
	 * @desc
	*/
    NCP.app.UploadCtrl = ctrl;
})(angular, NCP);