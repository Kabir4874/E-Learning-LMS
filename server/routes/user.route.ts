import express from "express";
import {
  getUserInfo,
  updateProfilePicture,
  updateUserInfo,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.get("/me", isAuthenticated, getUserInfo);

router.patch("/update", isAuthenticated, updateUserInfo);
router.patch("/update-avatar", isAuthenticated, updateProfilePicture);
export default router;
