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