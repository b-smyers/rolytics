import { Router } from "express";
import usersController from "@controllers/api/v1/users/users.controllers";

const router = Router();

router.get("/profile", usersController.getProfile);
router.get("/settings", usersController.getSettings);
router.post("/settings", usersController.updateSettings);

export default router;
