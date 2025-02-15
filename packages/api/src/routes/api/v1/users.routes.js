const express = require('express');
const usersController = require('@controllers/api/v1/users/users.controllers');

const router = express.Router();

router.get('/profile', usersController.getProfile);
router.get('/settings', usersController.getSettings);
router.post('/settings', usersController.updateSettings);

module.exports = router;
