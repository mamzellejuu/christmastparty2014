/**
 * Base Class for uploading file with canvas resizing
 * @param {Object} $container HTML container
 * @param {Object} Options Hash object options
 * Return {Object} Instance of FileUploadViewer Class
*/
var FileUploadViewer = function($container, options){
	this.options = $.extend({}, {
		size: 280,
		url: null
	}, options);

	this.container = $container;
	this.canvas = $('canvas', this.container)[0] || null;
	if(!this.canvas){
		throw new Error('A canvas HTML element is required to FileUploadManager instance works well !');
	}
	this.ctx = (this.canvas)? this.canvas.getContext('2d') : null;
	this.data = null;
	return this;
};

/**
 * @desc prototype methods
*/
$.extend(FileUploadViewer.prototype, {
	/**
	 * Initialize object instance
	 * @return {Object} Instance of FileUploadViewer Class
	*/
	init: function(){
		if(this.canvas){
			var size = parseInt(this.canvas.width);
			if(size){
				this.options.size = size;
			}
		}

		return this;
	},

	/**
	 * Return data URL image base64 encoded
	 * @return {String} URL image base64 encoded
	*/
	getData: function(){
		var data = this.data || null;
		if(!data && this.canvas){
			data = this.canvas.toDataURL();
		}

		return data;
	},

	/**
	 * Preview the image resizing in an HTML canvas
	 * @param {Object} img HTML DOM Image element
	 * @return {Object} Instance of FileUploadViewer Class
	*/
	preview: function(img){
		var size = this.options.size
		  , ctx = this.ctx;

		/* Rotate */
		ctx.drawImage(img, 0, 0, size, size);

		/* Set data */
		this.data = this.canvas.toDataURL();

		/* Event */
		$(this).trigger('previewFileUpload', [this]);

		return this;
	},

	/**
	 * Clear the object
	 * @return {Object} Instance of FileUploadViewer Class
	*/
	reset: function(){
		/* Clear canvas */
		var ctx = this.ctx
		  , size = this.options.size;
		ctx.clearRect (0, 0, size, size);

		return this;
	}
});

/**
 * File Uploader Manager Class
*/
var FileUploadManager = function(container, opts){
	/* Inheritance */
	FileUploadViewer.apply(this, arguments);
	/* Child Properties */
	this.form = $('form', this.container);
	this.file = $('input[type="file"]');
	this.rotation = 0;
	this.data = null;
	return this;
};

/* Inheritance */
FileUploadManager.prototype = Object.create(FileUploadViewer.prototype);

/* Overwrite methods */
$.extend(FileUploadManager.prototype, {
	init: function(){
		var self = this;

		this.file.bind('change', function(evt){
			/* Input type file */
			var target = evt.target;

			/* Event for interface */
			$(self).trigger('previewStartLoad');

			canvasResize(target.files[0], {
		        width: 280,
		        height: 280,
		        crop: true,
		        quality: 100,
		        callback: function(data, width, height) {
		            var img = new Image();

		            img.onload = function(){
						self.preview(img);
						/* Event for interface */
						$(self).trigger('previewLoaded');
					};

					/* Load image data */
					img.src = data;
		        }
		    });
		});

		return this;
	},

	rotate: function(){
		var img = new Image()
		  , src = this.data
		  , ctx = this.ctx
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