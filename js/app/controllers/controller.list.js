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
		$log.info('ListCtrl');
	});

	/**
	 * @desc
	*/
    NCP.app.ListCtrl = ctrl;
})(angular, NCP);