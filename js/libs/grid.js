"use strict";

/**
 * Grid object to display and change images
*/
var Grid = (function($){
	if(typeof Array.prototype.shuffle !== 'function'){
		Array.prototype.shuffle = function(){
			var i = this.length, j, temp;
			/* Not randomize loop for empty array */
  			if (i == 0) return this;
  			/* Randomize loop */
  			while (--i){
     			j = Math.floor( Math.random() * (i + 1));
     			temp = this[i];
     			this[i] = this[j];
     			this[j] = temp;
  			}
  			return this;
		};
	}
	
	/**
	 * Default settings to run Grid library
	*/
	var _settings = {
		selector: '.item',
		random: true
	};

	/**
	 * @description
	*/
	var _GridApplication = function(){
		this.settings = $.extend({}, _settings);
		this.order = [];
		this.frames = [];
		this.data = [];
		this.pointer = 0;
		return this.init();
	};
	
	$.extend(_GridApplication.prototype, {
		/**
		 * Initialize the grid instance
		 * Select frames and build the order of the update sequence
		 * @return {object} Instance of application grid class 
		*/
		init: function(){
			var selector = this.settings.selector
			  , frames = $(selector);
			  
			/* Check if items are catch by selector */
			if(frames.length){
				/* Build application components */
				this.frames = frames;
			}
			
			return this.setData().setOrder();
		},
	
		/**
		 * Update grid frame in sequence order
		 * The pointer value select the grid frame 
		 * @param {string} url image url to add in the grid 
		 * @param {boolean} transition if true the frame's transition is animated
		 * @return {object} Instance of application grid class
		*/
		framelize: function(data, transition){
			var l = this.length() - 1
			  , pointer = (this.pointer == l)? 0 : this.pointer + 1
			  , $frame = $(this.frames[this.order[pointer]]) || null;
			
			if($frame.length){
				var replace = $frame.data('url')
				  , index = this.data.indexOf(replace);
				
				if(index !== -1){
					/* Remove first frame data from data */
					this.data.splice(index, 1);
					/* Push new frame data in data */
					this.data.push(data);
					/* Change pointer */
					this.pointer = pointer;
					$frame.html(data).css({background: 'red'}).data('url', data);
					window.setTimeout(function(){
						$frame.css({background: 'none'});
					}, 3000);
				}
			}
			
			return this;
		},
		
		/**
		 * Build the order list for update sequence
		 * If random setting is true the order is randomized
		 * @return {object} Instance of application grid class
		*/
		setOrder: function(){
			var randomize = this.settings.random
			  , length = this.length()
			  , order = [];
			
			/* Push order by default in order choose array */
			for(var i = 0; i < length; i++){
				this.order.push(i);
			};
			
			/* Randomize order choose array */
			if(randomize){
				this.order = this.order.shuffle();
			}
			
			return this;
		},
		
		/**
		 * Return grid length
		 * @return {integer} grid length
		*/
		length: function(){
			return this.frames.length;
		},
		
		/**
		 * Return data property (list of elements used in the grid)
		 * @return {array} list of elements used in the grid
		*/
		getData: function(){
			var r = [];
			for(var i = 0, l = this.data.length; i < l; i++){
				r.push(this.data[i]);
			}
			
			return r;
		},
		
		/**
		 * Set data property (list of elements used in the grid)
		 * @return {object} Instance of application grid class
		*/
		setData: function(){
			for(var i = 0, l = this.frames.length; i < l; i++){
				var data = $(this.frames[i]).attr('data-url');
				this.data.push(data);
			}
			
			return this;
		}
	});
	
	/**
	 * Grid Application public interface
	*/
	var _Grid = {
		/* Set configs in application */
		configure: function(settings){
			for(var p in settings){
				if(_settings.hasOwnProperty(p)){
					_settings[p] = settings[p];
				}
			}
			
			return _Grid;
		},
		
		/* Run the application */
		run: function(settings){
			if(settings){
				_Grid.configure(settings);
			}
			
			return new _GridApplication();
		}
	};
	
	return _Grid;
})(jQuery);