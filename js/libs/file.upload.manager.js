/**
 * File Uploader Manager Class
*/
var FileUploadManager = function(container, opts){
	this.options = $.extend({}, {
		url: null,
		size: 280
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

			/* Event for interface */
			$(self).trigger('previewStartLoad');

			/* Listener for file reader */
			self.reader.onload = function(e){
				var src = e.target.result
				  , img = new Image();

				/* Image loading preview */
				img.onload = function(){
					self.preview(img);
					/* Event for interface */
					$(self).trigger('previewLoaded');
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

	preview: function(img){
		var settings = this.getPreviewSettings(img.width, img.height)
		  , left = settings.targetLeft
		  , top = settings.targetTop
		  , width = settings.width
		  , height = settings.height
		  , size = width
		  , ctx = this.canvas.getContext('2d');

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


var FileUploadViewer = function($container, options){
	this.options = $.extend({}, {
		size: 280,
		url: null
	}, options);

	this.container = $container;
	this.canvas = $('canvas', this.container)[0] || null;
	this.ctx = (this.canvas)? this.canvas.getContext('2d') : null;
	this.data = null;

	return this.init();
};

$.extend(FileUploadViewer.prototype, {
	init: function(){
		if(this.canvas){
			var size = parseInt(this.canvas.width);
			if(size){
				this.options.size = size;
			}
		}

		return this;
	},

	getData: function(){
		var data = this.data || null;
		if(!data && this.canvas){
			data = this.canvas.toDataURL();
		}

		return data;
	},

	preview: function(img){
		var settings = this.getPreviewSettings(img.width, img.height)
		  , left = settings.targetLeft
		  , top = settings.targetTop
		  , width = settings.width
		  , height = settings.height
		  , size = width
		  , ctx = this.ctx;

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
		/* Clear canvas */
		var ctx = this.ctx
		  , size = this.options.size;
		ctx.clearRect (0, 0, size, size);

		return this;
	}
});