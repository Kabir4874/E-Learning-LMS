import express from "express";
import { getUserInfo, updateUserInfo } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.get("/me", isAuthenticated, getUserInfo);

router.patch("/update-user", isAuthenticated, updateUserInfo);

export default router;
