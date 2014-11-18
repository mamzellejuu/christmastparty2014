(function(ng, NCP) {
	/**
	 * @desc Ctrl dependencies
	*/
	var ctrl = [
		'$scope',
		'$log',
		'Medias'
	];

	/**
	 * @desc Ctrl
	*/
	ctrl.push(function($scope, $log, Medias) {
		var length = 5
		  , grid = []
		  , items = []
		  , limit = (Medias.length >= length)? length : Medias.length;

		/* Items for Grid */
		for(var i = 0; i < limit; i++){
			var item = Medias[i];
			grid.push(item.file.url);
		}

		/* Elements to add in grid after load */
		if(Medias.length > limit){
			var limit = Medias.length;
			for(; i < limit; i++){
				var item = Medias[i];
				items.push(item.file.url);
			}
		}

		$scope.data = {
			grid: grid,
			items: items
		};
	});

	/**
	 * @desc
	*/
    NCP.app.GridCtrl = ctrl;
})(angular, NCP);