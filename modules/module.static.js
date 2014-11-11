module.exports = function(app, urls, io){
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

	app.get('/socket', function(req, res){
		io.sockets.emit('new media', {date: new Date().getTime(), msg: ''});
		res.setHeader('Content-Type', 'text/html');
        res.sendfile(app.get('staticPath') + '/index.html');
	});

    /* Public interface */
	return (function(urls){
    	var urls = urls || ['/'];
		return angular(urls);
	})(urls);
};