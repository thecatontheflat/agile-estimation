var UserModel = require('../models/user').User;
var passport = require('passport');
var helpers = require('../helpers/helpers');

/**
 * Sign up user
 * @param {Object} req
 * @param {Object} res
 */
exports.registerAction = function (req, res) {
    var postedUser = req.param('user');

    UserModel.register(new UserModel({email: postedUser.email}), postedUser.password, function (error) {
        if (null === error) {
            res.json(201, {success: {message: 'Registered successfully. You can login now'}});
        } else {
            res.json(400, {error: helpers.mongooseErrorReport(error)});
        }
    });
};

/**
 * Sign in user
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
exports.loginAction = function (req, res, next) {
    passport.authenticate('local', function (err, User, info) {
        var errorContainer = {};

        if (err) {
            return next(err);
        }

        if (!User) {
            errorContainer.message = 'Please, enter email and password';
            return res.json(440, {error: errorContainer});
        }

        req.logIn(User, function (err) {
            if (err) {
                return next(err);
            }

            return res.json({url: '/lobby'});
        });
    })(req, res, next);
};

/**
 * Sign out user
 * @param {Object} req
 * @param {Object} res
 */
exports.logOutAction = function (req, res) {
    req.logout();
    res.redirect('/');
};