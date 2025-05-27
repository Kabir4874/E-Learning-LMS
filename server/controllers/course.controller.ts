import cloudinary from "cloudinary";
import mongoose from "mongoose";
import { IAddQuestionData } from "../interfaces/course.interface";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import courseModel from "../models/course.model";
import ErrorHandler from "../utils/errorHandler";
import { redis } from "../utils/redis";
import TryCatch from "../utils/tryCatch";
export const uploadCourse = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "LMS_Thumbnails",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const course = await courseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  })
);

export const editCourse = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      if (thumbnail.public_id) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
      } else {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "LMS_Thumbnails",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    }
    const courseId = req.params.id;

    const course = await courseModel.findByIdAndUpdate(
      courseId,
      { $set: data },
      { new: true }
    );

    res.status(201).json({
      success: true,
      course,
    });
  })
);

export const getSingleCourse = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const courseId = req.params.id;
    const isCacheExist = await redis.get(courseId);
    if (isCacheExist) {
      const course = JSON.parse(isCacheExist);
      res.status(200).json({
        success: true,
        course,
      });
    } else {
      const course = await courseModel
        .findById(courseId)
        .select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
      await redis.set(courseId, JSON.stringify(course));
      res.status(200).json({
        success: true,
        course,
      });
    }
  })
);

export const getAllCourses = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const isCacheExist = await redis.get("allCourses");
    if (isCacheExist) {
      const courses = JSON.parse(isCacheExist);
      res.status(200).json({
        success: true,
        courses,
      });
    } else {
      const courses = await courseModel
        .find()
        .select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
      await redis.set("allCourses", JSON.stringify(courses));
      res.status(200).json({
        success: true,
        courses,
      });
    }
  })
);

export const getCourseByUser = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;
    const courseExists = userCourseList?.find(
      (course: any) => course._id.toString() === courseId
    );
    if (!courseExists) {
      return next(
        new ErrorHandler("You are not eligible to access this course", 404)
      );
    }
    const course = await courseModel.findById(courseId);
    const content = course?.courseData;
    res.status(200).json({
      success: true,
      content,
    });
  })
);

export const addQuestion = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { question, courseId, contentId }: IAddQuestionData = req.body;
    const course = await courseModel.findById(courseId);
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid content", 400));
    }
    const courseContent = course?.courseData.find((item: any) =>
      item._id.equals(contentId)
    );
    if (!courseContent) {
      return next(new ErrorHandler("Invalid content id", 400));
    }
    const newQuestion: any = {
      user: req.user,
      question,
      questionReplies: [],
    };
    courseContent.questions.push(newQuestion);
    await course?.save();
    res.status(200).json({
      success: true,
      course,
    });
  })
);
