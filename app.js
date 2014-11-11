//Required modules
var express = require('express')
  , http = require('http')
  , path = require('path')
  , conf = require('nconf')
  , _ = require('underscore');

/* Application node express */
var app = express();

// ================================================================================
// CONFIGURATION
// ================================================================================
app.config = conf.argv().env().defaults({store:require(path.join(__dirname,'/configs/default'))});

//ENV DEV
if(process.env.NODE_ENV == 'development'){
    app.use(express.errorHandler());
    app.config.defaults({store:_.extend(require(path.join(__dirname,'/configs/default')),require(path.join(__dirname,'/configs/dev')))});
    // Run Grunt task in development mode
    var grunt = require('grunt');
    grunt.tasks('dev', {}, function(){
        console.log('Grunt dev task started...');
    });
}

//ENV PROD
if(process.env.NODE_ENV == 'production'){
    app.config.defaults({store:_.extend(require(path.join(__dirname, '/configs/default')), require(path.join(__dirname, '/configs/prod')))});
    app.use(express.errorHandler());
}

//Set App port
app.set('port', process.env.PORT || app.config.get('application:port') || 3000);

app.set('basePath', __dirname);
app.set('staticPath', path.join( __dirname, '/public'));
app.set('modulePath', path.join( __dirname, '/modules'));
app.use(express.cookieParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(app.get('staticPath')));
app.use('/css', express.static(path.join(app.get('staticPath'), '/css')));
app.use('/js', express.static(path.join(app.get('staticPath'), '/js')));
app.use('/fonts', express.static(path.join(app.get('staticPath'), '/fonts')));
app.use('/img', express.static(path.join(app.get('staticPath'), '/img')));
app.use('/views', express.static(path.join(app.get('staticPath'), '/app/views')));
app.use('/languages', express.static(path.join(app.get('staticPath'), '/app/languages')));
app.use(app.router);
app.get("*",function(req,res,next){
    res.setHeader('X-Powered-By','NodeJS');
    next();
});

var server = http.createServer(app)
  , io = require('socket.io').listen(server);

// ================================================================================
// ROUTING
// ================================================================================
require(path.join(__dirname,'/routes'))(app, io);


// ================================================================================
// Start Server
// ================================================================================
server.listen(app.get('port'), function(){
    if(app.config.get('application:verbose')){
        console.log('Server listening on port ' + app.get('port'));
    }
});