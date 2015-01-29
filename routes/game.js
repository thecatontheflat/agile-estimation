var helpers = require('../helpers/helpers');
var GameModel = require('../models/game').Game;
var cookie = require('cookie');

exports.createAction = function (req, res) {
    var game = new GameModel();

    game.state = 'prepare';
    game.owner = req.user.email;
    game.creator = req.user.email;
    game.save(function (error, game) {
        var url = '/game/prepare/' + game._id;
        res.json(201, {url: url});
    });
};

exports.listActionApi = function (req, res) {
    GameModel.find({owner: req.user.email}).lean().exec(function (err, gamesList) {
        var games = {
            prepareGames: [],
            activeGames: [],
            archiveGames: []
        };

        gamesList.forEach(function (game) {
            if ('prepare' === game.state) {
                games.prepareGames.push(game);
            } else if ('active' === game.state) {
                games.activeGames.push(game)
            } else {
                games.archiveGames.push(game);
            }
        });

        res.json(games);
    });
};

exports.prepareAction = function (req, res) {
    var cardIcons = GameModel.schema.path('cardIcons').options.default;
    res.render('game/preparation', {
        id: req.params.id,
        cardIcons: cardIcons
    });
};

exports.findOneApi = function (req, res) {
    var condition = {_id: req.params.id};
    GameModel.findOne(condition).lean().exec(function (err, game) {
        res.json(game);
    });
};

exports.updateActionApi = function (req, res) {
    var condition = {_id: req.params.id};
    GameModel.findOne(condition, function (err, game) {

        //TODO: Probably add validation here
        var submittedGame = req.body;

        game.name = submittedGame.name ? submittedGame.name : 'no name';
        game.state = submittedGame.state;
        game.cards = helpers.cleanArray(submittedGame.cards);
        game.cardsRow = helpers.cleanArray(submittedGame.cardsRow);
        game.cardsDeck = helpers.cleanArray(submittedGame.cardsDeck.reverse());
        game.resizableColumns = submittedGame.resizableColumns;
        game.state = 'active';
        game.save();

        if (err) return res.json(400, {message: err});

        return res.json(200, {message: 'Saved'});
    });
};

exports.playAction = function (req, res) {
    var clientCookies = req.headers.cookie;
    var clientSessionCookie = null;

    if (clientCookies) {
        clientSessionCookie = cookie.parse(clientCookies)['express.sid'];
    }
    var condition = {_id: req.params.id};
    GameModel.findOne(condition, function (error, game) {
        if (null !== error || null == game) {
            return res.redirect('/');
        }

        var isGameOwner = false;
        var players = game.players;
        var isUserExist = false;

        if (req.user && game.creator == req.user.email) {
            isGameOwner = true;
        }

        for (var i = 0; i < players.length; i++) {
            if (players[i].session == clientSessionCookie) {
                isUserExist = true;
                break;
            }
        }

        var cardWidth = game.cards.length > 9 ? 1000 / game.cards.length : '120';
        var returnParams = {
            id: req.params.id,
            isUserExist: isUserExist,
            isGameOwner: isGameOwner,
            cardWidth: cardWidth,
            avatar: 'avatar'
        };

        res.render('game/play', returnParams);
    });
};

exports.removeGamePlayersApi = function (req, res) {
    var condition = {_id: req.params.id};

    GameModel.findOne(condition, function (err, game) {
        if (null === game) {
            res.json(200, {status: 'no such game with id - ' + req.params.id});
        }
        game.players = [];
        game.save();

        res.json(200, {status: 'done'});
    });
};