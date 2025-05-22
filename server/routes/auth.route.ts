import express from "express";
import {
  activateUser,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.post("/registration", registrationUser);
router.post("/activate-user", activateUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/refresh-token", updateAccessToken);
router.post("/social-auth", socialAuth);
router.patch("/update-password", isAuthenticated, updatePassword);
export default router;
