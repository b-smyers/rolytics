const express = require('express');

const { authenticate } = require('@middleware/auth.middleware');

const router = express.Router();

router.use('/auth', require('@routes/auth.routes'));
router.use('/users', authenticate, require('@routes/users.routes'));

module.exports = router;