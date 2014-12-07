var mongoose = require('mongoose');
var ClientModel = require('../models/user').Client;
var UserModel = require('../models/user').User;
var multiparty = require('multiparty');
var passport = require('passport');

/**
 * Action for home page
 * @param req
 * @param res
 */
exports.homePageAction = function (req, res) {
    if (req.user) {
        return res.redirect('/lobby');
    }

    res.render('homepage/index');
};

exports.lobbyPageAction = function (req, res) {
    res.render('lobby');
};

exports.aboutMethodPageAction = function (req, res) {
    res.render('about-method');
};

exports.howToPageAction = function (req, res) {
    res.render('how-to');
};

exports.aboutPageAction = function (req, res) {
    res.render('about');
};

exports.jiraAddonInstall = function (req, res) {
    var condition = {
        clientKey: req.body.clientKey,
        publicKey: req.body.publicKey,
        baseUrl: req.body.baseUrl
    };
    ClientModel.remove(condition, function () {
        UserModel.remove({clientKey: req.body.clientKey}, function() {
            var client = new ClientModel();
            client.clientKey = req.body.clientKey || '';
            client.publicKey = req.body.publicKey || '';
            client.sharedSecret = req.body.sharedSecret || '';
            client.serverVersion = req.body.serverVersion || '';
            client.pluginsVersion = req.body.pluginsVersion || '';
            client.baseUrl = req.body.baseUrl || '';
            client.productType = req.body.productType || '';
            client.description = req.body.description || '';
            client.eventType = req.body.eventType || '';

            client.save(function (error) {
                if (error) {
                    res.send(204);
                } else {
                    res.send(200);
                }
            });
        });
    });
};

exports.jiraAddonUninstall = function (req, res) {
    var condition = {
        clientKey: req.body.clientKey,
        publicKey: req.body.publicKey,
        baseUrl: req.body.baseUrl
    };
    ClientModel.remove(condition, function () {
        UserModel.remove({clientKey: req.body.clientKey}, function() {
            res.json(200, {status: 'done'});
        });
    });
};