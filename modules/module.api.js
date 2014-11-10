module.exports = function(app){
	var modulePath = app.get('modulePath')
	  , Cloud = require(modulePath + '/module.cloud.js')(app)
	  , settings = {
			name: 'Parse API',
			version: 'v1.0.0',
			author: 'Frederic GINIOUX',
			description: 'Parse Node API building for Nurun Christmast Party 2014'
		};

    /* Public interface */
	return {
		run: function(){
			/**
			 * @description Return API information
			 * @return {object} JSON object with information API
			*/
			app.get('/api', function(req, res){
				res.status(200).json(settings);
			});

			/**
			 * @description Return last 100 records in Cloud Storage
			 * @return {object} Response with data (data field)
			 * @example
			 * /api/medias/list
			 * Return : 
			 * {
			 * 		success: true,
			 * 		msg: "",
			 * 		token: null,
			 * 		data: [
			 *			{
			 * 				file: {
			 * 					__type: "File",
			 * 					name: "tfss-a7f899c5-a0f8-434e-a282-658cc834fd42-nurun-party1415654782757.jpg",
			 * 					url: "http://files.parsetfss.com/d2dae7c3-25fe-4335-a37c-22a20c7d6768/tfss-a7f899c5-a0f8-434e-a282-658cc834fd42-nurun-party1415654782757.jpg"
			 * 				},
			 * 				createdAt: "2014-11-10T21:26:57.998Z",
			 * 				updatedAt: "2014-11-10T21:26:57.998Z",
			 * 				objectId: "uvQH1fXsqZ"
			 * 			}
			 * 		]
			 * }
			*/
			app.get('/api/medias/list', function(req, res){
				/* Load last 100 medias */
				Cloud.list({limit: 100, order: '-createAt'}, function(response){
					res.status(200).json(response);
				});
			});

			/**
			 * @description Push new Media Object in API cloud Storage
			 * @return {object} Response with data (data field)
			 * @example
			 * /api/medias/media/uvQH1fXsqZ
			 * Return : 
			 * {
			 * 		success: true,
			 * 		msg: "",
			 * 		token: null,
			 * 		data: {
			 * 			file: {
			 * 				__type: "File",
			 * 				name: "tfss-a7f899c5-a0f8-434e-a282-658cc834fd42-nurun-party1415654782757.jpg",
			 * 				url: "http://files.parsetfss.com/d2dae7c3-25fe-4335-a37c-22a20c7d6768/tfss-a7f899c5-a0f8-434e-a282-658cc834fd42-nurun-party1415654782757.jpg"
			 * 			},
			 * 			createdAt: "2014-11-10T21:26:57.998Z",
			 * 			updatedAt: "2014-11-10T21:26:57.998Z",
			 * 			objectId: "uvQH1fXsqZ"
			 * 		}
			 * }
			*/
			app.get('/api/medias/media/:mediaID', function(req, res){
				var mediaID = req.params['mediaID'];
				/* Get unique object */
				Cloud.get(mediaID, function(response){
					res.status(200).json(response);
				});
			});

			/**
			 * @description Delete a media in API Cloud Storage
			 * @return {object} Response JSON
			 * @example
			 * /api/medias/delete/
			 * Return : 
			 * {
			 *		success: true,
			 * 		msg: "",
			 * 		token: null,
			 * 		data: null
			 * }
			*/
			app.post('/api/medias/delete/:mediaID', function(req, res){
				var mediaID = req.params['mediaID'];
				Cloud.del(mediaID, function(response){
					res.status(200).send(response);
				});
			});

			/**
			 * @description Add new Media Object in Cloud Storage
			 * @return {object} Response JSON with new Media Object Informations
			 * @example 
			 * /api/medias/add
			 * POST params : {file: 'base64DataUrlFromCanvas'}
			 * Return 
			 * {
			 * 		success: true,
			 *		msg: "",
			 *		token: null,
			 *		data: {
			 *			file: {
			 *				name: "tfss-a7f899c5-a0f8-434e-a282-658cc834fd42-nurun-party1415654782757.jpg",
			 *				__type: "File"
			 *			},
			 *			createdAt: "2014-11-10T21:26:57.998Z",
			 *			objectId: "uvQH1fXsqZ"
			 *		}
			 * }
			*/
			app.post('/api/medias/add', function(req, res){
				/* Prepare string base64 to be transform. in binary */
				var file = req.body.file.replace(/^data:image\/\w+;base64,/, "");
				Cloud.put({file: new Buffer(file, 'base64')}, function(response){
			    	res.status(200).send(response);
			    });

				/* TODO : to delete after test upload 
				var options = {
					host: 'a.dilcdn.com',
					port: 80,
					path: '/bl/wp-content/uploads/sites/8/2012/09/02-11.jpg'
				};

				http.get(options, function(response){
					response.setEncoding('binary');
					var d = '';
				    response.on('data', function(chunk){
				        d += chunk;
				    })

				    response.on('end', function(){
				    	var base64Data = new Buffer(d, 'binary').toString('base64')
				    	  , binaryData = new Buffer(base64Data, 'base64');

				    	Cloud.put({file: binaryData}, function(response){
					    	res.status(200).send(response);
					    });
					});
				});
				*/		
			});
		}
	}
};