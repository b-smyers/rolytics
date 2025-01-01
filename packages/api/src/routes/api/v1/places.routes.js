const express = require('express');

const placesController = require('@controllers/api/v1/places/places.controllers');
const analyticsController = require('@controllers/api/v1/places/analytics.controllers');
const performanceController = require('@controllers/api/v1/places/performance.controllers');
const playersController = require('@controllers/api/v1/places/players.controllers');
const purchasesController = require('@controllers/api/v1/places/purchases.controllers');
const socialController = require('@controllers/api/v1/places/social.controllers');

const router = express.Router();

router.get('/', placesController.getPlaces);

// Analytics
router.get('/analytics', analyticsController.getAnalytics);

// Performance
router.get('/performance', performanceController.getPerformance);

// Players
router.get('/players', playersController.getPlayers);

// Purchases
router.get('/purchases', purchasesController.getPurchases);

// Social
router.get('/social', socialController.getSocial);

module.exports = router;