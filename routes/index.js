module.exports = function(app){
	var modulePath = app.get('modulePath')
	  , StaticApplication = require(modulePath + '/module.static.js')(app)
	  , API = require(modulePath + '/module.api.js')(app);

	/*-----------------------------
	  Run Static Angular App.
	-----------------------------*/
	StaticApplication.run([
		'/',
		'/grid'
	]);

	/*-------------------
	  API routing
	-------------------*/
	API.run();
};