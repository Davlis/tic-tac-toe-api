'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _authenticate = require('./middleware/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

var _auth = require('./routes/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();

router.use('/auth', _auth2.default);

exports.default = router;