const express = require('express');

const analyticsController = require('@controllers/api/v1/experiences/analytics.controllers');
const performanceController = require('@controllers/api/v1/experiences/performance.controllers');
const playersController = require('@controllers/api/v1/experiences/players.controllers');
const purchasesController = require('@controllers/api/v1/experiences/purchases.controllers');
const socialController = require('@controllers/api/v1/experiences/social.controllers');

const router = express.Router();

// Analytics
router.get('/analytics/gameplay', analyticsController.getGameplay);
router.post('/analytics/gameplay', analyticsController.logGameplay);
router.get('/analytics/engagement', analyticsController.getEngagement);
router.post('/analytics/engagement', analyticsController.logEngagement);
router.get('/analytics/retention', analyticsController.getRetention);
router.post('/analytics/retention', analyticsController.logRetention);

// Performance
router.get('/performance/uptime', performanceController.getUptime);
router.post('/performance/uptime', performanceController.logUptime);
router.get('/performance/fps', performanceController.getFps);
router.post('/performance/fps', performanceController.logFps);
router.get('/performance/memory', performanceController.getMemory);
router.post('/performance/memory', performanceController.logMemory);
router.get('/performance/data-receive', performanceController.getDataReceive);
router.post('/performance/data-receive', performanceController.logDataReceive);
router.get('/performance/data-send', performanceController.getDataSend);
router.post('/performance/data-send', performanceController.logDataSend);
router.get('/performance/heartbeat', performanceController.getHeartbeat);
router.post('/performance/heartbeat', performanceController.logHeartbeat);
router.get('/performance/instances', performanceController.getInstances);
router.post('/performance/instances', performanceController.logInstances);
router.get('/performance/primitives', performanceController.getPrimitives);
router.post('/performance/primitives', performanceController.logPrimitives);
router.get('/performance/moving-primitives', performanceController.getMovingPrimitives);
router.post('/performance/moving-primitives', performanceController.logMovingPrimitives);
router.get('/performance/physics-receive', performanceController.getPhysicsReceive);
router.post('/performance/physics-receive', performanceController.logPhysicsReceive);
router.get('/performance/physics-send', performanceController.getPhysicsSend);
router.post('/performance/physics-send', performanceController.logPhysicsSend);
router.get('/performance/physics-step', performanceController.getPhysicsStep);
router.post('/performance/physics-step', performanceController.logPhysicsStep);

// Players
router.get('/players/active', playersController.getActive);
router.post('/players/active', playersController.logActive);
router.get('/players/new', playersController.getNew);
router.post('/players/new', playersController.logNew);
router.get('/players/returning', playersController.getReturning);
router.post('/players/returning', playersController.logReturning);
router.get('/players/demographics', playersController.getDemographics);
router.post('/players/demographics', playersController.logDemographics);

// Purchases
router.get('/purchases/passes', purchasesController.getPasses);
router.post('/purchases/passes', purchasesController.logPasses);
router.get('/purchases/developer-products', purchasesController.getDeveloperProducts);
router.post('/purchases/developer-products', purchasesController.logDeveloperProducts);
router.get('/purchases/subscriptions', purchasesController.getSubscriptions);
router.post('/purchases/subscriptions', purchasesController.logSubscriptions);

// Social
router.get('/social/chats', socialController.getChats);
router.post('/social/chats', socialController.logChats);
router.get('/social/friend-requests', socialController.getFriendRequests);
router.post('/social/friend-requests', socialController.logFriendRequests);
router.get('/social/invites', socialController.getInvites);
router.post('/social/invites', socialController.logInvites);

module.exports = router;