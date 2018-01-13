'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (sequelize) {
    const User = sequelize.define('user', SCHEMA);
    User.sync();

    User.hashPassword = (password, salt) => {
        return (0, _crypto.createHmac)('sha512', salt).update(password).digest('hex');
    };

    User.getAuthToken = (email, salt) => {
        return _jsonwebtoken2.default.sign({
            email
        }, salt);
    };

    return User;
};

var _sequelize = require('sequelize');

var _crypto = require('crypto');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SCHEMA = {
    id: {
        type: _sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: _sequelize.DataTypes.UUIDV4
    },
    firstName: {
        type: _sequelize.DataTypes.STRING
    },
    lastName: {
        type: _sequelize.DataTypes.STRING
    },
    passhash: {
        type: _sequelize.DataTypes.STRING(128),
        allowNull: true,
        get() {
            return undefined;
        }
    },
    email: {
        type: _sequelize.DataTypes.STRING(511),
        allowNull: false,
        unique: true,
        validate: {
            len: [5, 512],
            isEmail: true,
            forbiddenCharacters(val) {
                if (/[&=<>+,]/.test(val)) {
                    throw Error('Email contains forbidden characters');
                }
            },
            noTwoDotsInARow(val) {
                if (val.includes('..')) {
                    throw Error('Email can\'t have two dots in a row');
                }
            }
        }
    }
};