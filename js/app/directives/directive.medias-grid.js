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