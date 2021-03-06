var express = require('express');
var packageInfo = require('./package.json');

try {
    var config = require('./config.json');
} catch (err) {
    var config = require('./config.sample.json');
}

var indexController = require('./routes/index');
var importController = require('./routes/import');
var gameController = require('./routes/game');
var userController = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');
var UserModel = require('./models/user').User;
var helpers = require('./helpers/helpers');
var socketRoutes = require('./routes/sockets');

var environment = (process.argv[2] || 'prod');
var app = express();

// Database connection
var mongoose = require('mongoose', {server: {auto_reconnect: true}});
mongoose.connect(process.env.MONGOSOUP_URL || config.database.path);

// Session storage, using MongoDB
var MongoStore = require('connect-mongostore')(express);
var sessionStoreHolder = new MongoStore({mongooseConnection: mongoose.connection});

// All environments
app.set('port', (process.env.PORT || 3004));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.logger('dev'));
// Middlewares, that should be before passport:
app.use(express.cookieParser('eg'));
app.use(express.session({
    secret: 'eg-secret',
    key: 'express.sid',
    store: sessionStoreHolder
}));

// Passport:
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// Set private urls
app.all('/lobby', helpers.requireAuthentication);
app.all('/import', helpers.requireAuthentication);
app.all('/game/create', helpers.requireAuthentication);
app.all('/game/prepare/:id', helpers.requireAuthentication);

// Production only
if ('prod' == environment) {
    console.log('Production mode. Version: ', packageInfo.version);
}

// Development only
if ('dev' == environment) {
    // Prevents node from crashing on error
    process.on('uncaughtException', function (err) {
        console.error(err);
        console.log("Node NOT Exiting...");
    });

    console.log('Development mode. Version: ', packageInfo.version);
    app.use(express.errorHandler());
}

app.get('/', indexController.homePageAction);
app.get('/lobby', indexController.lobbyPageAction);
app.post('/import', importController.importPostAction);
app.post('/user/new', userController.registerAction);
app.post('/user/login', userController.loginAction);
app.get('/user/login', userController.loginAction);
app.get('/user/logout', userController.logOutAction);
app.post('/game/create', gameController.createAction);
app.get('/game/prepare/:id', gameController.prepareAction);
app.get('/game/play/:id', gameController.playAction);
app.get('/game/api/list', gameController.listActionApi);
app.get('/game/api/find/:id', gameController.findOneApi);
app.post('/game/api/update/:id', gameController.updateActionApi);
app.get('/game/api/players/remove/:id', gameController.removeGamePlayersApi);

var server = http.createServer(app);
var io = require('socket.io').listen(server);
socketRoutes(io);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
