import express from "express";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.post("/registration", registrationUser);
router.post("/activate-user", activateUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/refresh-token", updateAccessToken);
router.get("/me", isAuthenticated, getUserInfo);
router.post("/social-auth", socialAuth);
export default router;
