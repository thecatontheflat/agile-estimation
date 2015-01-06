var GameModel = require('../models/game').Game;
var helpers = require('../helpers/helpers');
var cookie = require('cookie');

module.exports = function (io) {
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
                game.save(function (error, game) {
                });

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
};