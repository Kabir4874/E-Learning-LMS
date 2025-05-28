import express from "express";

import { createOrder } from "../controllers/order.controller";
import { isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.post("/create", isAuthenticated, createOrder);

export default router;
