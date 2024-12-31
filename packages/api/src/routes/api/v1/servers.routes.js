const express = require('express');

const serversController     = require('@controllers/api/v1/servers/servers.controllers');
const dataController        = require('@controllers/api/v1/servers/data.controllers');
const analyticsController   = require('@controllers/api/v1/servers/analytics.controllers');
const performanceController = require('@controllers/api/v1/servers/performance.controllers');
const playersController     = require('@controllers/api/v1/servers/players.controllers');
const purchasesController   = require('@controllers/api/v1/servers/purchases.controllers');
const socialController      = require('@controllers/api/v1/servers/social.controllers');

const router = express.Router();

router.get('/', serversController.getServers);

// Data
router.post('/data', dataController.logData);

// Analytics
router.get('/analytics',   analyticsController.getAnalytics);

// Performance
router.get('/performance', performanceController.getPerformance);

// Players
router.get('/players', playersController.getPlayers);

// Purchases
router.get('/purchases', purchasesController.getPurchases);

// Social
router.get('/social', socialController.getSocial);

module.exports = router;