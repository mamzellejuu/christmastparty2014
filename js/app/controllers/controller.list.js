(function(ng, NCP) {
	/**
	 * @desc Ctrl dependencies
	*/
	var ctrl = [
		'$scope',
		'$log',
		'Medias',
		'MediasService'
	];

	/**
	 * @desc Ctrl
	*/
	ctrl.push(function($scope, $log, Medias, MediasService) {
		/**
		 * List items
		*/
		$scope.data = Medias;

		/**
		 * Delete item in list
		*/
		$scope.delete = function(objectId){
			if(window.confirm('Voulez-vous supprimer l\'image : ' + objectId)){
				MediasService.delete(objectId).then(function(){
					window.location.reload();
				}, function(){
					alert('Une erreur s\'est produite. Veuillez supprimer l\'image directement dans base de données.');
				});
			}
		};
	});

	/**
	 * @desc
	*/
    NCP.app.ListCtrl = ctrl;
})(angular, NCP);