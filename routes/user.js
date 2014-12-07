var UserModel = require('../models/user').User;
var VerificationToken = require('../models/user').VerificationToken;
var passport = require('passport');
var helpers = require('../helpers/helpers');
var mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Sign up user
 * @param {Object} req
 * @param {Object} res
 */
exports.registerAction = function (req, res) {
    var postedUser = req.param('user');

    VerificationToken.register(new VerificationToken({email: postedUser.email}), postedUser.password, function (error, addedToken) {
        if (null === error) {
            var nodeMailer = require('nodemailer');
            var transporter = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '___',
                    pass: '___'
                }
            });

            transporter.sendMail({
                from: '___',
                to: postedUser.email,
                subject: 'Email Validation',
                text: 'To confirm your email please visit this link: http://estimation.agile-values.com/verify/' + addedToken._id
            });

            res.json(201, {success: {message: 'Verification email was sent'}});

            return;
        }

        res.json(400, {error: helpers.mongooseErrorReport(error)});
    });
};

/**
 * Verify up user
 *
 * @param {Object} req
 * @param {Object} res
 */
exports.verifyUserAction = function (req, res) {
    var userId = req.param('id');
    if (null !== userId.match(mongoIdPattern)) {
        VerificationToken.findOne({_id: userId}, function (err, token) {
            if (token == null || err != null) {
                return res.redirect('/');
            }

            var user = new UserModel({
                email: token.email,
                salt: token.salt,
                hash: token.hash,
                _id: token._id
            });

            user.save(function (err, user) {
                token.remove();
                res.render('verify');
            });
        });
    } else {
        res.redirect('/');
    }

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