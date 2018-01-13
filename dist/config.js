'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = generateConfig;

var _dotenv = require('dotenv');

function generateConfig() {
    const env = (0, _dotenv.load)({ path: '.env' }).parsed || process.env;

    return {
        env: env.ENV,
        port: env.PORT,
        salt: env.SALT,
        postgres: {
            uri: env.DATABASE_URL,
            maxIdleTime: +(env.DATABASE_MAX_IDLE_TIME || 0),
            maxPoolSize: +env.DATABASE_MAX_POOL_SIZE || 100
        }
    };
}