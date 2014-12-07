/**
 * Check if user is authorized or not. If not - redirect to home page
 * @param req
 * @param res
 * @param next
 */
var requireAuthentication = function (req, res, next) {
    if (false === req.isAuthenticated()) {
        res.redirect('/')
    }

    next();
};

/**
 * Build object with errors for response
 * @param error Expect mongoose structure error
 * @param uniqueErrorCode
 * @return {Object}
 */
var mongooseErrorReport = function (error, uniqueErrorCode) {
    var errorContainer = {};
    uniqueErrorCode = uniqueErrorCode || 11000;

    // We have error
    errorContainer.message = error.message;
    errorContainer.details = [];

    // Check if we have error with unique field
    if (uniqueErrorCode === error.code) {
//        errorContainer.message = 'Unique field error';
//        errorContainer.details.push('Email is already in use');
    }

    if (error.errors) {
        for (var key in error.errors) {
            errorContainer.details.push(error.errors[key].message);
        }
    }

    return errorContainer;
};

/**
 * Get id of session from cookie value
 * @param {String} cookieValue
 * @returns {string|null}
 */
var getSessionIdFromCookie = function (cookieValue) {
    var cookieParts = cookieValue.split('.');

    return cookieParts[0] ? cookieParts[0].replace('s:', '') : null;
};

var cleanArray = function (actual) {
    var newArray = [];
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
};

exports.requireAuthentication = requireAuthentication;
exports.mongooseErrorReport = mongooseErrorReport;
exports.getSessionIdFromCookie = getSessionIdFromCookie;
exports.cleanArray = cleanArray;