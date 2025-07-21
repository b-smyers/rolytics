import { Router } from "express";

import serversController from "@controllers/api/v1/servers/servers.controllers";
import dataController from "@controllers/api/v1/servers/data.controllers";
import analyticsController from "@controllers/api/v1/servers/analytics.controllers";
import performanceController from "@controllers/api/v1/servers/performance.controllers";
import playersController from "@controllers/api/v1/servers/players.controllers";
import purchasesController from "@controllers/api/v1/servers/purchases.controllers";
import socialController from "@controllers/api/v1/servers/social.controllers";

const router = Router();

router.get("/", serversController.getServers);
router.post("/open", serversController.openServer);
router.post("/close", serversController.closeServer);
router.post("/data", dataController.logData);

router.get("/analytics", analyticsController.getAnalytics);
router.get("/performance", performanceController.getPerformance);
router.get("/players", playersController.getPlayers);
router.get("/purchases", purchasesController.getPurchases);
router.get("/social", socialController.getSocial);

export default router;
