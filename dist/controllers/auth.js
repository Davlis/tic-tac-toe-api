'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.login = login;
exports.register = register;

var _utils = require('../utils');

async function login(req, res) {
    const config = res.app.get('config');
    const { email, password } = req.body;
    const { User } = req.app.get('models');

    const user = await User.find({
        where: {
            email: email
        }
    });

    (0, _utils.assertOrThrow)(user, Error, 'User not found');

    (0, _utils.assertOrThrow)(user.getDataValue('passhash') === User.hashPassword(password, config.salt), Error, 'Invalid password');

    const token = User.getAuthToken(email, config.salt);

    res.send({ user, token });
}

async function register(req, res) {
    const config = res.app.get('config');
    const { email, password, lastName, firstName } = req.body;
    const { User } = req.app.get('models');

    const passhash = User.hashPassword(password, config.salt);

    const user = await User.create({
        email,
        password,
        lastName,
        firstName,
        passhash
    });

    res.send(user);
}