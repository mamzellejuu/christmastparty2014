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