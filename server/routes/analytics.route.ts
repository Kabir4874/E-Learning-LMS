import express from "express";

import { getUserAnalytics } from "../controllers/analytics.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.get("/user", isAuthenticated, authorizeRoles("admin"), getUserAnalytics);

export default router;
