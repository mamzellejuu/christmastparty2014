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

				/* Remove title bar */
				$(window).bind('load', function(){
					if(!load){
						window.scrollTo(0,1);
						load = true;
					}
				});
			}
		}
	});

	NCP.app.directive('ncpContextClass', directive);
})(angular, NCP);