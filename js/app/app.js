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