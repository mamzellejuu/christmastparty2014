module.exports = function(app, urls){
	/**/
	var credentials = {
		login: 'nous',
		password: 'nowel2014'
	};

	/**
	 * Authentification for secure page access
	*/
	var express = require('express')
	  , auth = express.basicAuth(credentials.login, credentials.password);

    /* Run Angular application with load index.html */
    function getApplication(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendfile(app.get('staticPath') + '/index.html' );
        return;
    }

    /* Run Angular application for all urls */
	var angular = function(routes){
		for(var i = 0, l = routes.length; i < l; i++){
			var route = routes[i]
			  , secure = route.secure
			  , url = route.url
			  , params = [url, getApplication];

			  if(secure){
			  	params.splice(1,0, auth);
			  }

			app.get.apply(app, params);
		}

		return true;
	};

    /* Public interface */
	return (function(urls){
    	var urls = urls || ['/'];
		return angular(urls);
	})(urls);
};