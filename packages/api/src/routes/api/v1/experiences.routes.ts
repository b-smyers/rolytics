import { Router } from "express";

import experiencesController from "@controllers/api/v1/experiences/experiences.controllers";
import analyticsController from "@controllers/api/v1/experiences/analytics.controllers";
import performanceController from "@controllers/api/v1/experiences/performance.controllers";
import playersController from "@controllers/api/v1/experiences/players.controllers";
import purchasesController from "@controllers/api/v1/experiences/purchases.controllers";
import socialController from "@controllers/api/v1/experiences/social.controllers";

const router = Router();

router.get("/", experiencesController.getExperiences);
router.post("/connect", experiencesController.connectExperience);
router.post("/disconnect", experiencesController.disconnectExperience);

router.get("/analytics", analyticsController.getAnalytics);
router.get("/performance", performanceController.getPerformance);
router.get("/players", playersController.getPlayers);
router.get("/purchases", purchasesController.getPurchases);
router.get("/social", socialController.getSocial);

export default router;
