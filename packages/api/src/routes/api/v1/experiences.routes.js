const express = require('express');

const analyticsController = require('@controllers/api/v1/experiences/analytics.controllers');
const performanceController = require('@controllers/api/v1/experiences/performance.controllers');
const playersController = require('@controllers/api/v1/experiences/players.controllers');
const purchasesController = require('@controllers/api/v1/experiences/purchases.controllers');
const socialController = require('@controllers/api/v1/experiences/social.controllers');

const router = express.Router();

// Analytics
router.get('/analytics/gameplay', analyticsController.getGameplay);
router.get('/analytics/engagement', analyticsController.getEngagement);
router.get('/analytics/retention', analyticsController.getRetention);

// Performance
router.get('/performance/uptime', performanceController.getUptime);
router.get('/performance/fps', performanceController.getFps);
router.get('/performance/memory', performanceController.getMemory);
router.get('/performance/data-receive', performanceController.getDataReceive);
router.get('/performance/data-send', performanceController.getDataSend);
router.get('/performance/heartbeat', performanceController.getHeartbeat);
router.get('/performance/instances', performanceController.getInstances);
router.get('/performance/primitives', performanceController.getPrimitives);
router.get('/performance/moving-primitives', performanceController.getMovingPrimitives);
router.get('/performance/physics-receive', performanceController.getPhysicsReceive);
router.get('/performance/physics-send', performanceController.getPhysicsSend);
router.get('/performance/physics-step', performanceController.getPhysicsStep);

// Players
router.get('/players/active', playersController.getActive);
router.get('/players/new', playersController.getNew);
router.get('/players/returning', playersController.getReturning);
router.get('/players/demographics', playersController.getDemographics);

// Purchases
router.get('/purchases/passes', purchasesController.getPasses);
router.get('/purchases/developer-products', purchasesController.getDeveloperProducts);
router.get('/purchases/subscriptions', purchasesController.getSubscriptions);

// Social
router.get('/social/chats', socialController.getChats);
router.get('/social/friend-requests', socialController.getFriendRequests);
router.get('/social/invites', socialController.getInvites);

module.exports = router;