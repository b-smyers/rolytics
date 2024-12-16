const express = require('express');

const robloxController = require('@controllers/api/v1/roblox/roblox.controllers');

const router = express.Router();

router.post('/place-details', robloxController.getPlaceDetails);

module.exports = router;