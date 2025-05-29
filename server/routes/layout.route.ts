import express from "express";

import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.post("/create", isAuthenticated, authorizeRoles("admin"), createLayout);
router.patch("/update", isAuthenticated, authorizeRoles("admin"), editLayout);
router.get("/get", getLayoutByType);

export default router;
