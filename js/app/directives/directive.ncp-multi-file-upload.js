(function(ng, NCP){
	var directive = [
		'$log',
		'$timeout',
		'MediasService'
	];

	directive.push(function($log, $timeout, MediasService){
		return {
			restrict: 'A',
			link: function($scope, elem, attrs){
				var $form = $('form', elem)
				  , $file = $('input[type="file"]', $form);

				$file.bind('change', function(evt){
					/* Input type file */
					var target = evt.target
					  , files = target.files
					  , l = files.length
					  , items = []
					  , j = 0;

					for(var i = 0; i < l; i++){
						(function(file){
							canvasResize(file, {
						        width: 1000,
						        height: 1000,
						        crop: true,
						        quality: 99,
						        callback: function(data, width, height) {
						            var img = new Image();

						            img.onload = function(){
										items.push({url: data});
										j++;

										if(j == l){
											$timeout(function(){
												$scope.items = items;
											}, 0, true);
										}
									};

									/* Load image data */
									img.src = data;
						        }
						    });
						})(files[i]);	
					}
				});

				$timeout(function(){
					$scope.items = [];
				}, 0, true);

				var upload = function(t, index){
					var l = t.length
					  , i = index || 0
					  , $item = $('.item[data-index=' + i + ']');

					if(l){
						var url = t[i].url
						  , fileViewer = new FileUploadViewer($item, {url: url}).init()
						  , img = $('img', $item)[0];

						$(fileViewer).bind('previewFileUpload', function(){
							var data = fileViewer.data;
							if(data){
								var cb = function(){
									$item.fadeOut(1000, function(){
										$item.remove();
										i++;
										if(i<l){
											$timeout(function(){
												upload(t, i);
											}, 500);
										}
									});
								};

								/* Service Call*/
								MediasService.create(data).then(function(data, status){
									cb();
								}, function(data, status){
									alert('Oups... il semble que ce soit FG. qui soit le developpeur de cette chose !!!! Désolé... venez me voir pour me remercier quand même !');
									cb();
								});
							}
						});

						fileViewer.preview(img);
					}
				};

				$scope.upload = function(){
					upload($scope.items);
				};

				$scope.remove = function($index){
					var items = [];
					for(var i = 0, l = $scope.items.length; i < l; i++){
						if(i != $index){
							items.push($scope.items[i]);
						}
					}

					$timeout(function(){
						$scope.items = items;
					}, 0, true);

				};

				$(document).delegate('.item', 'click', function(e){
					var $target = $(e.target)
					  , $parent = $target.parents('.item:first');

					if($parent.length){
						$parent.fadeOut(500, function(){
							$parent.remove();
						});
					}
				});
			}
		}
	});

	NCP.app.directive('ncpMultiFileUpload', directive);
})(angular, NCP);