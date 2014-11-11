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
		$log.info('GridCtrl');
	});

	/**
	 * @desc
	*/
    NCP.app.GridCtrl = ctrl;
})(angular, NCP);