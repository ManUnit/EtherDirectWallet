'use strict';

var authenticator = require('authenticator'); // https://www.npmjs.com/package/authenticator
var twoFA = {};

twoFA.verify = function(formatKey, appKey) {
    var formattedToken = authenticator.generateToken(formatKey);
    if (formattedToken === appKey) {
        return true;
    } else {
        return false;
    }
}

twoFA.genkey = function(req) {
    var formattedKey = authenticator.generateKey();
    return formattedKey;
}

twoFA.genUrl = function(formattedKey, email, text) {
    return authenticator.generateTotpUri(formattedKey, email, text, 'SHA1', 6, 30);
}

exports.twoFA = twoFA;