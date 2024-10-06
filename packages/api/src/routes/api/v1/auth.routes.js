const express = require('express');

const { authenticate } = require('@middleware/auth.middleware');

const authController = require('@controllers/api/v1/auth/auth.controllers');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.post('/verify', authenticate, authController.verify);

module.exports = router;
