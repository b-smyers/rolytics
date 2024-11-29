const express = require('express');

const dataController        = require('@controllers/api/v1/servers/data.controllers');
const analyticsController   = require('@controllers/api/v1/servers/analytics.controllers');
const performanceController = require('@controllers/api/v1/servers/performance.controllers');
const playersController     = require('@controllers/api/v1/servers/players.controllers');
const purchasesController   = require('@controllers/api/v1/servers/purchases.controllers');
const socialController      = require('@controllers/api/v1/servers/social.controllers');

const router = express.Router();

// Data
router.post('/data', dataController.logData);

// Analytics
router.get('/analytics/gameplay',   analyticsController.getGameplay);
router.get('/analytics/engagement', analyticsController.getEngagement);
router.get('/analytics/retention',  analyticsController.getRetention);

// Performance
router.get('/performance', performanceController.getPerformance);

// Players
router.get('/players/active',       playersController.getActive);
router.get('/players/new',          playersController.getNew);
router.get('/players/returning',    playersController.getReturning);
router.get('/players/demographics', playersController.getDemographics);

// Purchases
router.get('/purchases/passes',             purchasesController.getPasses);
router.get('/purchases/developer-products', purchasesController.getDeveloperProducts);
router.get('/purchases/subscriptions',      purchasesController.getSubscriptions);

// Social
router.get('/social/chats',           socialController.getChats);
router.get('/social/friend-requests', socialController.getFriendRequests);
router.get('/social/invites',         socialController.getInvites);

module.exports = router;