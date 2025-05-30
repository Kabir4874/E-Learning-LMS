import express from "express";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  getAllCourses,
  getCourseByUser,
  getCourses,
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
router.get("/get", getAllCourses);
router.get("/content/:id", isAuthenticated, getCourseByUser);
router.patch("/add-question", isAuthenticated, addQuestion);
router.patch("/add-answer", isAuthenticated, addAnswer);
router.patch("/add-review/:id", isAuthenticated, addReview);
router.patch(
  "/add-review-reply",
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);

router.get("/get-all", isAuthenticated, authorizeRoles("admin"), getCourses);
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteCourse);
export default router;
