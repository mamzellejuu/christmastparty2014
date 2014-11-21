(function(ng, NCP){
	var directive = [
		'$log',
		'$timeout',
		'$location'
	];

	directive.push(function($log, $timeout, $location){
		return {
			restrict: 'A',
			link: function($scope, elem, attrs){
				var path = $location.path()
				  , name = 'main';

				if(path == '/grid'){
					name = 'main-grid';
				}

				elem.addClass(name); 
			}
		}
	});

	NCP.app.directive('ncpContextClass', directive);
})(angular, NCP);