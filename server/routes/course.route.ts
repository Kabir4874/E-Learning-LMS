import express from "express";
import {
  editCourse,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
const router = express.Router();

router.post("/create", isAuthenticated, authorizeRoles("admin"), uploadCourse);
router.patch(
  "/update/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);
router.get("/get/:id", getSingleCourse);
export default router;
