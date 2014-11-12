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