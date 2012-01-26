
/**
 * Module dependencies.
 */

var express = require('express')
  , MemoryStore = express.session.MemoryStore
  , sessionStore = new MemoryStore()
  , mongoose = require('mongoose')
  , routes = require('./routes')
  

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "84abb59b0c93ac1d1fb47548b14d77db", key: "express.sid", store: sessionStore }));
  app.use(express.methodOverride());
  app.use(require('connect-less')({compress:true, src: __dirname + '/public'}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.dynamicHelpers(require('./helpers').dynamicHelpers);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('db-location', 'mongodb://localhost/jamesrundquist-test');
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  app.set('db-location', 'mongodb://localhost/jamesrundquist');
});

// Routes
app.get('/', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


