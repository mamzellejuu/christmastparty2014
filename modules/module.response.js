module.exports = function(app){
	var _ = require('underscore');

    /* Public interface */
	return {
		/**
		 * @description
		*/
		push: (function(){
			/**
			 * Default response structure
			*/
			var _params = {
				success: false,
				msg: '',
				token: null,
				data: null
			};

			/**
			 * @param {object} Params list to return
			 * @param {object} Data to push in the response (Array, Object, etc.)
			 * @return {object} Response object complete
			 * @see _params default response structure
			*/
			return function(params, data){
				/* Add data in params */
				_.extend(params, {
					data: data
				});

				/* Merge default params with method params */
				var r = {};
				for(var p in _params){
					var v = _params[p];
					if(params.hasOwnProperty(p)){
						v = params[p];
					}
					r[p] = v;
				}

				return r;
			}
		})(),

		/**
		 * @description Check is a response is a success type
		 * @param {object} Response object to check
		 * @return {boolean} Success response's status 
		*/
		isSuccess: function(response){
			var r = false
			  , prop = 'success'
			  , prefixError = 'NCP response error : ';

			/**
			 * Check if success property exists
			*/
			if(response.hasOwnProperty(prop)){
				/**
				 * Check if success property is type boolean
				*/
				if(typeof response[prop] !== 'boolean'){
					throw new Error(prefixError + 'response success property must be a boolean value.');
				} else {
					r = response[prop];
				}
			} else {
				throw new Error(prefixError + 'response success must have a success property.');
			}

			return r;
		}
	}
};