(function(ng, NCP) {
	/**
	 * @desc Ctrl dependencies
	*/
	var service = [
		'$http',
		'$q',
		'$log'
	];

	/**
	 * @desc Ctrl
	*/
	service.push(function($http, $q, $log) {
		var apiUrl = '/api';
		
		return {
			get: function(){
				var url = apiUrl + '/medias/list'
				  , deferred = $q.defer();

				$http.get(url).then(function(r, status){
					var d = r.data;
					if(d.success){
						deferred.resolve(d.data);
					} else deferred.reject();
				}, function(error, status){
					deferred.reject();
				});

				return deferred.promise;
			},

			create: function(p_mediaData){
				var url = apiUrl + '/medias/add'
				  , params = {file: p_mediaData}
				  , deferred = $q.defer();

				$http.post(url, params).then(function(data, status){
					deferred.resolve(data);
				}, function(data, status){
					deferred.reject();
				});

				return deferred.promise;
			},

			delete: function(p_mediaId){
				var url = apiUrl + '/medias/delete'
				  , params = {id: p_mediaId}
				  , deferred = $q.defer();

				$http.post(url, params).then(function(data, status){
					deferred.resolve(data);
				}, function(error, status){
					deferred.reject();
				});

				return deferred.promise;
			}
		}
	});

	/**
	 * @desc
	*/
	NCP.app.factory('MediasService', service);
})(angular, NCP);