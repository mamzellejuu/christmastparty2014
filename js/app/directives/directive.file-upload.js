(function(ng, NCP){
	/**
	 * File Uploader Manager Class
	*/
	var FileUploadManager = function(container, opts){
		this.options = $.extend({}, {
			url: null,
			size: 300
		}, opts);

		this.container = $(container);
		this.form = $('form', this.container);
		this.file = $('input[type="file"]');
		this.reader = new FileReader();
		this.canvas = $('canvas', this.container)[0] || null;
		this.rotation = 0;
		this.data = null;
		if(!this.canvas){
			throw new Error('A canvas HTML element is required to FileUploadManager instance works well !');
		}

		return this.init();
	};

	$.extend(FileUploadManager.prototype, {
		init: function(){
			var canvas = this.canvas
			  , ctx = this.canvas.getContext('2d')
			  , self = this;

			this.file.bind('change', function(evt){
				/* Input type file */
				var target = evt.target;

				/* Listener for file reader */
				self.reader.onload = function(e){
					var src = e.target.result
					  , img = new Image();

					/* Image loading preview */
					img.onload = function(){
						self.preview(img, 90);
					};

					/* Load image data */
					img.src = src;
				};

				/* Read information in target input type file */
				self.reader.readAsDataURL(target.files[0]);
			});

			return this;
		},

		getData: function(){
			var data = null;
			if(this.canvas){
				data = this.canvas.toDataURL();
			}

			return data;
		},

		preview: function(img, rotation){
			var settings = this.getPreviewSettings(img.width, img.height)
			  , left = settings.targetLeft
			  , top = settings.targetTop
			  , width = settings.width
			  , height = settings.height
			  , size = width
			  , ctx = this.canvas.getContext('2d')
			  , rotation = rotation || 0;

			/* Rotate */
			ctx.drawImage(img, left, top, width, height);
			/* Set data */
			this.data = this.canvas.toDataURL();
			/* Event */
			$(this).trigger('previewFileUpload', [this]);

			return this;
		},

		getPreviewSettings: function(srcWidth, srcHeight){
			var targetWidth = this.options.size
			  , targetHeight = this.options.size
			  , width = targetWidth
			  , height = targetHeight;

		    /* Scale to the target width */
		    var scaleX1 = targetWidth
		      , scaleY1 = (srcHeight * targetWidth)/srcWidth;

		    /* Scale to the target height */
		    var scaleX2 = (srcWidth * targetHeight)/srcHeight
		      , scaleY2 = targetHeight;

    		/* Now figure out which one we should use */
    		if(scaleX2 > targetWidth){
    			/* Landscape image */
    			width = Math.floor(scaleX2);
		    } else {
		    	height = Math.floor(scaleY1);
		    }

		    var result = {
				width: width,
				height: height,
				targetLeft: Math.floor((targetWidth - width)/2),
				targetTop: Math.floor((targetHeight - height)/2)
			};

    		return result;
		},

		reset: function(){
			/* Reset the form. */
			this.form[0].reset();
			/* Clear canvas */
			var ctx = this.canvas.getContext('2d')
			  , size = this.options.size;
			ctx.clearRect (0, 0, size, size);

			return this;
		},

		rotate: function(){
			var img = new Image()
			  , src = this.data
			  , ctx = this.canvas.getContext('2d')
			  , size = this.options.size
			  , center = size/2;

			this.rotation = (this.rotation != 270)? this.rotation+90 : 0;

			if(src.length){
				var self = this;
				img.onload = function(){
					ctx.save();
					ctx.clearRect (0, 0, size, size);
					ctx.translate(center, center);
					ctx.rotate(self.rotation*Math.PI/180);
					ctx.drawImage(img, -1*center, -1*center, size, size);
					ctx.restore();
				};

				img.src = src;
			}

			return this;
		}
	});

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

			$scope.restart = function(){
				$scope.$emit('restart');
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
					fileUploadManager = new FileUploadManager(elem, {});
					/* On preview */
					$(fileUploadManager).bind('previewFileUpload', function(){
						$logo.fadeOut();
						$dos.fadeIn('slow');
		    			$one.fadeOut();
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

					$scope.$on('restart', function(){
						$okLarge.removeClass('active');
						$replayImg.removeClass('active');
						$one.fadeIn();
						$trio.fadeOut();
						$dos.css({opacity: 1});
					});
				}
			}
		}
	});

	NCP.app.directive('ncpFileUpload', directive);
})(angular, NCP);