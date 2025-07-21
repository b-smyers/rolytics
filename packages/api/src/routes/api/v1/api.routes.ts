import { Router } from "express";
import { authenticate } from "@middleware/auth.middleware";
import authRouter from "@routes/api/v1/auth.routes";
import usersRouter from "@routes/api/v1/users.routes";
import experiencesRouter from "@routes/api/v1/experiences.routes";
import placesRouter from "@routes/api/v1/places.routes";
import serversRouter from "@routes/api/v1/servers.routes";
import robloxRouter from "@routes/api/v1/roblox.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", authenticate, usersRouter);
router.use("/experiences", authenticate, experiencesRouter);
router.use("/places", authenticate, placesRouter);
router.use("/servers", authenticate, serversRouter);
router.use("/roblox", authenticate, robloxRouter);

export default router;
