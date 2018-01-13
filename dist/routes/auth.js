'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _utils = require('../utils');

var _auth = require('../controllers/auth');

var authController = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const router = (0, _express.Router)();

router.post('/login', (0, _utils.errorWrap)(authController.login));
router.post('/register', (0, _utils.errorWrap)(authController.register));

exports.default = router;