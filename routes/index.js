module.exports = function(app, ioSocket){
	var modulePath = app.get('modulePath');

	/*-----------------------------
	  Run Static Angular App.
	-----------------------------*/
	var urls = [
		{url: '/', secure: false},
		{url: '/grid', secure: true}, 
		{url: '/list', secure: true}, 
		{url: '/upload', secure: true}
	];
	
	require(modulePath + '/module.static.js')(app, urls);

	/*-------------------
	  API routing
	-------------------*/
	require(modulePath + '/module.api.js')(app, ioSocket);
};