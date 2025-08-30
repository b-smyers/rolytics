import { Router } from "express";

import { authenticate } from "@middleware/auth.middleware";

import authController from "@controllers/api/v1/auth/auth.controllers";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);
router.post("/verify", authenticate, authController.verify);

export default router;
