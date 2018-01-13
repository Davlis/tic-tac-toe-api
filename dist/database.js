'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = initSequelizeFromConfig;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initSequelizeFromConfig(config) {
    const sequelize = new _sequelize2.default(config.postgres.uri, {
        dialect: 'postgres'
    });
    const models = {
        User: (0, _user2.default)(sequelize)
    };

    return { sequelize, models };
}