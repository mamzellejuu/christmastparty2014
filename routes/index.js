module.exports = function(app, ioSocket){
	var modulePath = app.get('modulePath');

	/*-----------------------------
	  Run Static Angular App.
	-----------------------------*/
	require(modulePath + '/module.static.js')(app, ['/', '/grid'], ioSocket);

	/*-------------------
	  API routing
	-------------------*/
	require(modulePath + '/module.api.js')(app, ioSocket);
};