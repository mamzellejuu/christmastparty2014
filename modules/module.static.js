module.exports = function(app){
    /* Run Angular application with load index.html */
    function getApplication(req, res){
        res.setHeader('Content-Type', 'text/html');
        res.sendfile(app.get('staticPath') + '/index.html' );
        return;
    }

    /* Run Angular application for all urls */
	var angular = function(urls){
		for(var i = 0, l = urls.length; i < l; i++){
			var uri = urls[i];
			app.get(uri, getApplication);
		}

		return true;
	};

    /* Public interface */
	return {
        /* Run static Angular App with list of urls */
		run: function(urls){
            var urls = urls || ['/'];
			return angular(urls);
		}
	}
};