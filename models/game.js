var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema({
    key: String,
    link: String,
    title: String,
    estimate: {type: String},
    isReference: Boolean,
    description: String,
    typeIcon: String,
    priorityIcon: String,
    reporter: String
});

var playerSchema = new Schema({
    name: String,
    session: String,
    isConnected: Boolean,
    isAgreed: Boolean,
    isActive: Boolean
});

var resizableColumnSchema = new Schema({
    score: String,
    width: String
});

var states = 'prepare join active archive'.split(' ');

var gameSchema = new Schema({
    name: {type: String},
    state: {type: String, enum: states},
    cards: [cardSchema],
    cardsRow: [cardSchema],
    cardsDeck: [cardSchema],
    owner: {type: String},
    creator: {type: String},
    players: {type: Array},
    dateTime: {type: Date, default: Date.now},
    resizableColumns: [resizableColumnSchema],
    cardIcons: {type: Array, default: {
        'story': 'glyphicon glyphicon-eye-open',
        'bug': 'glyphicon glyphicon-fire',
        'spike': 'glyphicon glyphicon-flash',
        'epic': 'glyphicon glyphicon-plus'
    }}
});

module.exports = {
    Game: mongoose.model('Game', gameSchema),
    Card: mongoose.model('Card', cardSchema),
    Player: mongoose.model('Player', playerSchema)
};
