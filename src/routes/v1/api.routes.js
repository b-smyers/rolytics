const express = require('express');

const { authenticate } = require('@middleware/auth.middleware');

const router = express.Router();

router.use('/auth', require('@routes/v1/auth.routes'));
router.use('/users', authenticate, require('@routes/v1/users.routes'));
router.use('/experiences', authenticate, require('@routes/v1/experiences.routes'));
router.use('/servers', authenticate, require('@routes/v1/servers.routes'));

module.exports = router;