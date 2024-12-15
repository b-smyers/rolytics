const express = require('express');

const experiencesController = require('@controllers/api/v1/experiences/experiences.controllers');
const analyticsController = require('@controllers/api/v1/experiences/analytics.controllers');
const performanceController = require('@controllers/api/v1/experiences/performance.controllers');
const playersController = require('@controllers/api/v1/experiences/players.controllers');
const purchasesController = require('@controllers/api/v1/experiences/purchases.controllers');
const socialController = require('@controllers/api/v1/experiences/social.controllers');

const router = express.Router();

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