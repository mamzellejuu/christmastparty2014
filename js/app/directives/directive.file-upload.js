(function(ng, NCP){
	/* Depencies */
	var directive = [
		'$log',
		'$timeout',
		'MediasService'
	];

	directive.push(function($log, $timeout, MediasService){
		var fileUploadManager = null
		  , successEventName = 'onSuccessUpload'
		  , serviceUrl = '/api/medias/add';

		var ctrl = ['$scope', function($scope){
			var process = false;
			$scope.upload = function(){
				var data = fileUploadManager.getData();
				if(data && !process){
					/* DOM manipulation */
					$scope.$emit('startUpload');
					/* Start request */
					process = true;
					/* Service Call*/
					MediasService.create(data).then(function(data, status){
						$scope.$emit(successEventName);
						process = false;
					}, function(data, status){
						alert('Oups... il semble que ce soit FG. qui soit le developpeur de cette chose !!!! Désolé... venez me voir pour me remercier quand même !');
						process = false;
					});
				} else {
					alert('Oups... ça nous prend un fichier image et beaucoup de patience... recommence on ne sait jamais !!!!');
				}
			};

			/* Reset form && restart upload process */
			$scope.reset = function(){
				fileUploadManager.reset();
			};

			$scope.restart = function(force){
				$scope.$emit('restart', [force]);
			};

			$scope.rotation = function(){
				fileUploadManager.rotate();
			};
		}];

		return {
			restrict: 'E',
			controller: ctrl,
			link: function($scope, elem, attrs){
				var $form = $('form', elem);
				if($form.length){
					/* DOM elements */
					var $trio = $('#trio', elem)
					  , $dos = $('#dos', elem)
					  , $one = $('#one', elem)
					  , $logo = $('#logo', elem)
					  , $okLarge = $('#oklarge', elem)
					  , $replayImg = $('#replay img', elem);


					/* Instance of FileUploadManager Class */
					fileUploadManager = new FileUploadManager(elem, {}).init();

					/* On preview */
					$(fileUploadManager).bind('previewFileUpload', function(){
						$logo.fadeOut();
						$dos.fadeIn('slow');
		    			$one.fadeOut();
					}).bind('previewStartLoad', function(){
						$form.addClass('bling');
					}).bind('previewLoaded', function(){
						$form.removeClass('bling');
					});

					/* Fake feed back */
					$scope.$on(successEventName, function(){
						$trio.fadeIn('fast');
						$dos.fadeOut();
						$timeout(function(){
							$logo.fadeIn();
							$timeout(function(){
								$okLarge.addClass('active');
							}, 60, false);
							
							$replayImg.addClass('active');
							fileUploadManager.reset();
						}, 60, false);
					});

					$scope.$on('startUpload', function(){
						// Jouer dans le DOM quand y'a succès!
						$dos.animate({opacity: 0.3});
					});

					$scope.$on('restart', function(evt, params){
						if(params){
							window.location.reload();
						} else {
							$okLarge.removeClass('active');
							$replayImg.removeClass('active');
							$one.fadeIn();
							$trio.fadeOut();
							$dos.css({opacity: 1});
						}
					});
				}
			}
		}
	});

	NCP.app.directive('ncpFileUpload', directive);
})(angular, NCP);