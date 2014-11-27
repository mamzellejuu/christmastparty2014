(function(ng, NCP){
	/***/
	var Grid = (function(){
		var n = 20
		  , m = 5
		  , l = 3
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

	  	var _grid = []
	  	  , _items = [];

		return {
			/***/
			get: function(data){
				var r = ng.copy(structure)
				  , j = 0;

				/* Build structure */
				for(var p in r){
					var limit = r[p].length;
					for(var i = 0; i < limit; i++, j++){
						var f = data[j] || '';
						r[p].data.push(f);
					}
				}

				return r;
			},

			length: function(){
				return limit; 
			},

			items: function(){
				return _items;
			},

			grid: function(){
				return _grid;
			}
		}
	})();

	NCP.app.factory('GridModel', [function(){
		return {
			init: function(medias){
				/* Items for Grid */
				var length = Grid.length()
				  , mediasLength = medias.length
				  , __grid = []
				  , __items = []
		  		  , limit = (mediasLength >= length)? length : mediasLength;

				for(var i = 0; i < limit; i++){
					var item = medias[i];
					__grid.push({url: item.file.url});
				}
				/* Set Grid */
				_grid = __grid;

				/* Elements to add in grid after load */
				if(mediasLength > limit){
					var limit = mediasLength;
					for(; i < limit; i++){
						var item = medias[i];
						__items.push({url: item.file.url});
					}
				}
				/* Set Items */
				_items = __items;

				return true;
			},
			grid: function(){
				return _grid;
			},
			items: function(){
				return _items;
			},
			get: function(){
				return Grid.get(_grid);
			}
		}
	}]);
})(angular, NCP);