import express from "express";
import {
  getAllUser,
  getUserInfo,
  updateProfilePicture,
  updateUserInfo,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.get("/me", isAuthenticated, getUserInfo);

router.patch("/update", isAuthenticated, updateUserInfo);
router.patch("/update-avatar", isAuthenticated, updateProfilePicture);
router.get("/get-all", isAuthenticated, authorizeRoles("admin"), getAllUser);
export default router;
