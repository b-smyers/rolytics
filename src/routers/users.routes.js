const express = require('express');
const usersController = require('../controllers/users.controller');

const router = express.Router();

router.get('/profile', usersController.getProfile);
router.get('/settings', usersController.getSettings);
router.post('/settings', usersController.updateSettings);
// router.post('/experiences', require('./experiences.routes'));

module.exports = router;
