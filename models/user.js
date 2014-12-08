var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    email: {type: String},
    password: {type: String},
    createdAt: {type: Date, default: Date.now}
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = {
    User: mongoose.model('User', userSchema)
};