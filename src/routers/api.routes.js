const express = require('express');

const { isAuthenticated } = require('../middlware/auth.middleware');

const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', isAuthenticated, require('./users.routes'));

module.exports = router;
