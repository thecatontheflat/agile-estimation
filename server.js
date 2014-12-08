var express = require('express');
var packageInfo = require('./package.json');
var config = require('./config.json');
var routes = require('./routes');
var indexController = require('./routes/index');
var importController = require('./routes/import');
var gameController = require('./routes/game');
var userController = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('./models/user').User;
var helpers = require('./helpers/helpers');
var cookie = require('cookie');

var environment = (process.argv[2] || 'prod');
var app = express();

// Database connection
var mongoose = require('mongoose');
mongoose.connect(config.database.path);

// Session storage, using MongoDB
var MongoStore = require('connect-mongostore')(express);
var sessionStoreHolder = new MongoStore({'db': 'sessions'});

// All environments
app.set('port', 3004);
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
app.get('/verify/:id', userController.verifyUserAction);

var server = http.createServer(app);
var io = require('socket.io').listen(server);
var GameModel = require('./models/game').Game;

io.sockets.on('connection', function (client) {
    var clientCookies = client.handshake.headers.cookie;
    var clientSessionCookie = cookie.parse(clientCookies)['express.sid'];


    client.on('disconnect', function () {
        var condition = {_id: client['room']};
        GameModel.findOne(condition, function (err, game) {
            if (!game || game === null) {
                return;
            }

            for (var i = 0; i < game.players.length; i++) {
                if (game.players[i].session == clientSessionCookie) {
                    game.players[i].isConnected = false;
                }
            }
            game.markModified('players');

            game.save();
            client.broadcast.emit('updateGameField', game);
        });
    });

    // Game Play sockets
    client.on('joinGame', function (emitData) {
        client['room'] = emitData.gameId;
        client['name'] = emitData.userName;

        client.join(emitData.gameId);

        var condition = {_id: emitData.gameId};
        GameModel.findOne(condition, function (err, game) {
            if (!game) {
                return;
            }

            // If user exists in session
            if (emitData.isPlayerExists) {
                var players = game.players;

                for (var i = 0; i < players.length; i++) {
                    if (players[i].session == clientSessionCookie) {
                        players[i].isConnected = true;
                        players[i].avatar = emitData.avatar;
                        break;
                    }
                }
                game.players = players;
            } else {
                game.players.push({
                    name: emitData.userName,
                    isConnected: true,
                    session: clientSessionCookie,
                    avatar: emitData.avatar
                });
            }

            game.markModified('players');
            game.save(function (error, game) {});

//            io.sockets.emit('updateGameField', game);
            io.sockets.emit('joinGame', game);
        });
    });

    client.on('updateGameField', function (data) {
        if (data.creator == "vitaliy.zurian@gmail.com" && data.name == "Demo Game") {
            return;
        }

        var condition = {_id: data._id};
        GameModel.findOne(condition, function (err, game) {
            game.cardsRow = helpers.cleanArray(data.cardsRow);
            game.cardsDeck = helpers.cleanArray(data.cardsDeck);
            game.resizableColumns = data.resizableColumns;
            game.state = data.state;
            game.save();
        });

        client.broadcast.to(client['room']).emit('updateGameField', data);
    });

    client.on('updateResizableColumns', function (data) {
        client.broadcast.to(client['room']).emit('updateResizableColumns', data);
    });

    client.on('blinkCard', function (cardIndex) {
        client.broadcast.to(client['room']).emit('blinkCard', cardIndex);
    });

    client.on('updateLoggerStack', function (loggerItem) {
        io.sockets.emit('updateLoggerStack', loggerItem);
    });

    client.on('busy-ui', function () {
        client.broadcast.to(client['room']).emit('busy-ui');
    });

    client.on('free-ui', function () {
        client.broadcast.to(client['room']).emit('free-ui');
    });
});

// Run server
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
