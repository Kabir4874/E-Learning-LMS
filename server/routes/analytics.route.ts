import express from "express";

import {
  getCourseAnalytics,
  getOrderAnalytics,
  getUserAnalytics,
} from "../controllers/analytics.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.get("/user", isAuthenticated, authorizeRoles("admin"), getUserAnalytics);
router.get(
  "/course",
  isAuthenticated,
  authorizeRoles("admin"),
  getCourseAnalytics
);
router.get(
  "/order",
  isAuthenticated,
  authorizeRoles("admin"),
  getOrderAnalytics
);

export default router;
