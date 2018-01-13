'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = authenticate;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function authenticate(req, res, next) {
    const config = res.app.get('config');
    const { authorization } = req.headers;
    let user;

    if (authorization.includes('Bearer ')) {
        const token = authorization.replace('Bearer ', '');
        try {
            user = _jsonwebtoken2.default.verify(token, config.salt);
        } catch (err) {
            throw new Error('Invalid token');
        }
    } else if (authorization.includes('User ')) {
        user = authorization.replace('User ', '');
    } else {
        throw new Error('Authentication error');
    }

    res.locals.user = user;
    next();
}