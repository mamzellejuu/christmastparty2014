$('document').ready(function(){
	/* Test Socket IO Only on default url / */
	var path = window.location.pathname;
	if(path == '/'){
		var socket = io();
		socket.on('new media', function(data){
			console.log(data);
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