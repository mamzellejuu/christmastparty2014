module.exports = function(app, ioSocket){
	var modulePath = app.get('modulePath');

	/*-----------------------------
	  Run Static Angular App.
	-----------------------------*/
	var urls = ['/', '/grid', '/list', '/upload'];
	require(modulePath + '/module.static.js')(app, urls);

	/*-------------------
	  API routing
	-------------------*/
	require(modulePath + '/module.api.js')(app, ioSocket);
};