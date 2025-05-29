import express from "express";

import {
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.get(
  "/get-all",
  isAuthenticated,
  authorizeRoles("admin"),
  getNotifications
);

router.patch(
  "/update/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateNotification
);

export default router;
