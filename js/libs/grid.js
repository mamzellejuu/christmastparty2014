"use strict";

/**
 *
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
			if(!frames.length){
				throw new Error('Grid Application need items ! Selector ' + selector + ' does\'nt match any DOM elements.');
			} else {
				/* Build application components */
				this.frames = frames;
			}
			
			return this.order();
		},
		
		/**
		 * Update grid frame in sequence order
		 * The pointer value select the grid frame 
		 * @param {string} url image url to add in the grid 
		 * @param {boolean} transition if true the frame's transition is animated
		 * @return {object} Instance of application grid class
		*/
		framelize: function(url, transition){
			var l = this.length() - 1
			  , pointer = (this.pointer == l)? 0 : this.pointer + 1
			  , frame = this.frames[pointer] || null;
			
			if(frame){
				
			}
			
			return this;
		},
		
		/**
		 * Build the order list for update sequence
		 * If random setting is true the order is randomized
		 * @return {object} Instance of application grid class
		*/
		order: function(){
			var randomize = this.settings.random
			  , length = this.length()
			  , order = [];
			
			/* Push order by default in order choose array */
			for(var i = 0; i < length; i++){
				this.order.push(i);
			};
			
			/* Randomize order choose array */
			if(randomize){
				this.order.shuffle();
			}
			
			return this;
		},
		
		/**
		 * Return grid length
		 * @return {integer} grid length
		*/
		length: function(){
			return this.frames.length;
		}
	});
	
	/**
	 * Grid Application public interface
	*/
	var _Grid = {
		configure: function(settings){
			for(var p in _settings){
				if(settings.hasOwnPropterty(p)){
					_settings[p] = settings[p];
				}
			}
			
			return _Grid;
		},
		
		run: function(settings){
			if(settings){
				_Grid.configure(settings);
			}
			
			return new _GridApplication();
		}
	};
	
	return _Grid;
})(jQuery);