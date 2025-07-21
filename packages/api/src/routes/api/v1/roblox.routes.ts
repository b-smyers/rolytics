import { Router } from "express";

import robloxController from "@controllers/api/v1/roblox/roblox.controllers";

const router = Router();

router.post("/place-details", robloxController.getPlaceDetails);

export default router;
