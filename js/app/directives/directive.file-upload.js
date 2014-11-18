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
				img.src = src;
				ctx.save();
				ctx.clearRect (0, 0, size, size);
				ctx.translate(center, center);
				ctx.rotate(this.rotation*Math.PI/180);
				ctx.drawImage(img, -1*center, -1*center, size, size);
				ctx.restore();
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
			$scope.upload = function(){
				var data = fileUploadManager.getData();
				if(data){
					MediasService.create(data).then(function(data, status){
						$scope.$emit(successEventName);
					}, function(data, status){
						alert('Serveur error !!!!');
					});
				} else {
					alert('Error !!!!');
				}
			};

			/* Reset form && restart upload process */
			$scope.reset = function(){
				fileUploadManager.reset();
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
					/* Instance of FileUploadManager Class */
					fileUploadManager = new FileUploadManager(elem, {});
					/* Fake feed back */
					$scope.$on(successEventName, function(){
						var $c = $('.step-3 p', elem).css({background: 'green'});
						$timeout(function(){
							$c.css({background: 'none'});
							fileUploadManager.reset();
						}, 1000, false);
					});
				}
			}
		}
	});

	NCP.app.directive('ncpFileUpload', directive);
})(angular, NCP);