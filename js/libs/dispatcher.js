"use strict";

/**
 * Object dispatcher to pick element in dynamic list
 * @param {array} picked array of element already used
 * @param {array} bucket array of element to used
*/
var Dispatcher = function(picked, bucket, opts){
	if(!$.isArray(picked) || !$.isArray(bucket)){
		throw new Error('Arguments of new Dispatcher must be Array !');
	}
	
	this.options = $.extend({}, {
		delay: 10*1000
	}, opts);
		
	/* Dynamic list */
	this.bucket = bucket || [];
	/* Elements already used */
	this.picked = picked || [];
	/* Element to ignore */
	this.excluded = this.picked.slice(0);
	/* Timeout to make pick request */
	this.timeout = null;
	
	return this.init();
};
	
$.extend(Dispatcher.prototype, {
	init: function(){
		return this.run();
	},
		
	run: function(){
	 	if(this.timeout){
			window.clearTimeout();
			this.timeout = null;
		}
			
		var that = this
		  , delay = this.options.delay;
			  
		/* Delay pick action */
		this.timeout = window.setTimeout(function(){
			var element = that.pick();
			if(element){
				$(that).trigger('Dispatcher::picked', [element]);
			}
				
			/* Call method run recursively */
			that.run();
		}, delay);
		
		return this;
	},
		
	pick: function(){
		var bucket = (this.bucket.length)? this.bucket : this.picked
		  , elt = null;
			
		/* Get element ont excluded */
		for(var i = 0, l = bucket.length; i < l; i++){
			var c = bucket[i];
			if(this.excluded.indexOf(c) == -1){
				elt = c;
				/* Remove element in the bucket */
				bucket.splice(i, 1);
				break;
			}
		}
			  
		if(elt){
			/* Add element at the end of the picked elements array */
			this.picked.push(elt);
		}
			
		return elt;
	},
		
	push: function(elt){
		/* Add element at the end of the bucket elements array */
		this.bucket.push(elt);
		return this;
	},
		
	setExcluded: function(elements){
		this.excluded = elements;
		return this;
	},

	destroy: function(){
		if(this.timeout){
			window.clearTimeout();
			this.timeout = null;
		}

		delete this;

		return null;
	}
});