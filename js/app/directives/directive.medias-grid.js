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

						interval = window.setInterval(function(){
							elem.isotope('shuffle');
						}, delay);

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