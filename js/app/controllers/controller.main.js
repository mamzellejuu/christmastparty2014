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
		$log.info('MainCtrl');
	});

	/**
	 * @desc
	*/
    NCP.app.MainCtrl = ctrl;
})(angular, NCP);