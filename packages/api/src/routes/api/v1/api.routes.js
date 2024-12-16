const express = require('express');

const { authenticate } = require('@middleware/auth.middleware');

const router = express.Router();

router.use('/auth', require('@routes/api/v1/auth.routes'));
router.use('/users', authenticate, require('@routes/api/v1/users.routes'));
router.use('/experiences', authenticate, require('@routes/api/v1/experiences.routes'));
router.use('/servers', authenticate, require('@routes/api/v1/servers.routes'));
router.use('/roblox', authenticate, require('@routes/api/v1/roblox.routes'));

module.exports = router;