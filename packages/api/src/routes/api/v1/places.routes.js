const express = require('express');

const placesController = require('@controllers/api/v1/places/places.controllers');

const router = express.Router();

router.get('/', placesController.getPlaces);

module.exports = router;