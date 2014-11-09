module.exports = function(app){
	var modulePath = app.get('modulePath')
	  , staticApp = require(modulePath + '/module.static.js')(app)
	  , staticUrls = ['/', '/grid'];

	/* Run Static Angular App. */
	staticApp.run(staticUrls);

	/* API routing */

};