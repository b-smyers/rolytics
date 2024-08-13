const express = require('express');

const { authenticate } = require('../middlware/auth.middleware');

const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', authenticate, require('./users.routes'));

module.exports = router;