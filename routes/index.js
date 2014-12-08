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