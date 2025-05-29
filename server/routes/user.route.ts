import express from "express";
import {
  deleteUser,
  getAllUser,
  getUserInfo,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.get("/me", isAuthenticated, getUserInfo);

router.patch("/update", isAuthenticated, updateUserInfo);
router.patch("/update-avatar", isAuthenticated, updateProfilePicture);
router.patch(
  "/update-role",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);
router.get("/get-all", isAuthenticated, authorizeRoles("admin"), getAllUser);

router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteUser);
export default router;
