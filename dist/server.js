'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = initApp;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.on('unhandledRejection', console.error);

const config = (0, _config2.default)();
const { sequelize, models } = (0, _database2.default)(config);

const depedencies = { sequelize, models };

const app = initApp(config, depedencies);

app.listen(config.port, () => {
    console.log(`App listening on port ${config.port}!`);
});

function initApp(config, depedencies) {
    const app = (0, _express2.default)();

    app.set('config', config);
    app.set('models', depedencies.models);
    app.set('sequelize', depedencies.sequelize);

    app.use((0, _morgan2.default)('dev'));

    app.use((0, _cors2.default)({ origin: true }));

    app.use(_bodyParser2.default.urlencoded({ limit: '12mb',
        extended: false,
        parameterLimit: 1000000 }));
    app.use(_bodyParser2.default.json({ limit: '12mb' }));

    app.use(_routes2.default);

    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({
            statusCode: err.status || 500,
            error: err.name,
            message: err.message
        });
    });
    app.use((req, res) => {
        res.status(404).json({
            statusCode: 404,
            error: 'Not Found',
            message: 'No such route'
        });
    });

    return app;
}