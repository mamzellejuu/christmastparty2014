(function(ng, NCP){
	/***/
	var Grid = (function(){
		var n = 15
		  , m = 5
		  , l = 2
		  , limit = n + m + l;

		/**
		* @desc Base Grid Structure
		*/
		var structure = {
	  		normal: {
	  			data: [],
	  			length: n
	  		},
	  		medium: {
	  			data: [],
	  			length: m
	  		},
	  		large: {
	  			data: [],
	  			length: l
	  		}
	  	};

		return {
			/***/
			get: function(data){
				var r = ng.extend({}, {}, structure)
				  , j = 0;

				/* Build structure */
				for(var p in r){
					if(p != 'spacers'){
						var limit = r[p].length;
						for(var i = 0; i < limit; i++, j++){
							var f = data[j] || '';
							r[p].data.push(f);
						}
					}
				}

				return r;
			},

			length: function(){
				return limit; 
			}
		}
	})();

	NCP.app.factory('GridModel', [function(){
		return {
			grid: function(){

			},
			items: function(){
				
			},
			get: function(data){
				return Grid.get(data);
			},
			length: function(){
				return Grid.length();
			}
		}
	}]);
})(angular, NCP);