import express from "express";

import { createOrder, getAllOrders } from "../controllers/order.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.post("/create", isAuthenticated, createOrder);
router.get("/get-all", isAuthenticated, authorizeRoles("admin"), getAllOrders);

export default router;
