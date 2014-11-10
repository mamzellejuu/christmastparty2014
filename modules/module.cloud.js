module.exports = function(app){
	/* Dependencies */
	var modulePath = app.get('modulePath')
	  , Kaiseki = require('kaiseki')
	  , Response = require(modulePath + '/module.response.js')(app);

	/* Cloud configuration settings */
	var configs = {
		name: "nurun-noel-2014",
		applicationID: "yzcJJ3ZKhLHW4qfWgbZroKcYWXXr7to8WiJxgime",
		clientKey: "U8lksMh9rjruRLscxqy5wJHHMcZMupI6IheL8DtE",
		javascriptKey: "FpsmDaTsC9xoXtNhKbxxqBsHcbaBbsOFgfAsE8nP",
		restApiKey: "NG6jpw5FMa0FQTPjEyKblTJY9G8plQYbW3IOWFFa",
		masterKey: "SC0Hkr4IgRmcFP08jtdHLxmpF8fY4wtLK0OwpN4H"
	};

	/* ID key on cloud table */
	var mediaObjIDKey = 'objectId'
	  , mediaObjName = 'media';

	/* Connection object */
	var connector = null;

	/* Check if library is available */
	if(Kaiseki){
		/* Connection */
		connector = new Kaiseki(configs.applicationID, configs.restApiKey);
		/* Set master key for connector (delete file requirement) */
		connector.masterKey = configs.masterKey;
	}

	/**
	 * @description Check if an object is valide for create request params
	 * @param {object} params 
	 * @return {boolean} true if object is valide
	*/
	var validateParamsObject = function(params){
		var required = ['file']
		  , r = true;

		for(var p in params){
			if(required.indexOf(p) == -1){
				r = false;
				break;
			}
		}

		return r;
	};

	/* Public interface */
	return {
		get: function(objectId, cb){
			var r = {
				success: false,
				msg: 'Error call cloud storage',
				token: 'NCP.cloud.get.error'
			};

			if(connector){
				/* Call API cloud storage */
				connector.getObject(mediaObjName, objectId, {},  function(err, res, body, success){
					var response = Response.push(r, null);
					if(success){
						response = Response.push({
							success: true
						}, body);
					}

					cb.call(null, response);
				});
			} else {
				throw new Error('NCP cloud error : no connection with cloud storage.');
			}

			return;
		},

		list: function(params, cb){
			var r = {
				success: false,
				msg: 'Error call cloud storage',
				token: 'NCP.cloud.list.error'
			};

			params = params || {};

			if(connector){
				/* Call API cloud storage */
				connector.getObjects(mediaObjName, params,  function(err, res, body, success){
					var response = Response.push(r, null);
					if(success){
						response = Response.push({
							success: true
						}, body);
					}

					cb.call(null, response);
				});
			} else {
				throw new Error('NCP cloud error : no connection with cloud storage.');
			}

			return;
		},

		put: function(params, cb){
			var r = {
				success: false,
				msg: 'Error call cloud storage',
				token: 'NCP.cloud.put.error'
			};

			if(connector){
				if(validateParamsObject(params)){
					/* Save File in Cloud Storage */
					connector.uploadFileBuffer(params.file, 'image/jpeg', 'nurun-party' + new Date().getTime() +'.jpg', function(err, res, body, success) {
						var response = Response.push(r, null);
						if(success){
							/* Set file field with media uploaded */
							params.file = {
							    name: body.name,
							    __type: 'File'
							};
							
							/* Store new Object media */
							connector.createObject(mediaObjName, params, function(err, res, body, success){
								var response = Response.push(r, null);
								if(success){
									response = Response.push({
										success: true
									}, body);
								}

								cb.call(null, response);
							});
						} else {
							cb.call(null, response);
						}
					});
				} else {
					throw new Error('NCP cloud error : created object params not valide.');
				}
			} else {
				throw new Error('NCP cloud error : no connection with cloud storage.');
			}

			return;
		},

		del: function(objectId, cb){
			var r = {
				success: false,
				msg: 'Error call cloud storage',
				token: 'NCP.cloud.delete.error'
			};

			if(connector){
				connector.deleteObject(mediaObjName, objectId, function(err, res, body, success){
					var response = Response.push(r, null);
					if(success){
						response = Response.push({
							success: true
						}, null);
					}

					cb.call(null, response);
				});
			} else {
				throw new Error('NCP cloud error : no connection with cloud storage.');
			}

			return;
		}
	}
};