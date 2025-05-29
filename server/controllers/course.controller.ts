import cloudinary from "cloudinary";
import mongoose from "mongoose";
import {
  IAddQuestionData,
  IAddReviewData,
  IAddReviewReplyData,
} from "../interfaces/course.interface";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import courseModel from "../models/course.model";
import notificationModel from "../models/notification.model";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import sendEmail from "../utils/mail";
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
      await redis.set(courseId, JSON.stringify(course), "EX", 604800);
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

    await notificationModel.create({
      userId: req.user._id,
      title: "New Question Received",
      message: `You have a new question in ${courseContent?.title}`,
    });
    await course?.save();
    res.status(200).json({
      success: true,
      course,
    });
  })
);

export const addAnswer = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { answer, courseId, contentId, questionId } = req.body;
    const course = await courseModel.findById(courseId);
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid content id", 400));
    }
    const courseContent = course?.courseData.find((item: any) =>
      item._id.equals(contentId)
    );
    if (!courseContent) {
      return next(new ErrorHandler("Invalid content id", 400));
    }
    const question = courseContent.questions.find((item: any) =>
      item._id.equals(questionId)
    );
    if (!question) {
      return next(new ErrorHandler("Invalid question id", 400));
    }

    const newAnswer: any = {
      user: req.user,
      answer,
    };
    question.questionReplies?.push(newAnswer);
    await course?.save();
    if (req.user?._id === question.user._id) {
      await notificationModel.create({
        userId: req.user._id,
        title: "New Question Reply Received",
        message: `You have a new question reply in ${courseContent?.title}`,
      });
    } else {
      const data = {
        name: question.user.name,
        title: courseContent.title,
      };
      try {
        await sendEmail({
          email: question.user.email,
          subject: "Question Reply",
          template: "question-reply.ejs",
          data,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
    res.status(200).json({
      success: true,
      course,
    });
  })
);

export const addReview = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);
    const userCourseList = user?.courses;
    const courseId = req.params.id;
    const courseExists = userCourseList?.some(
      (course: any) => course.courseId.toString() === courseId
    );
    if (!courseExists) {
      return next(
        new ErrorHandler("You are not eligible to access this course", 400)
      );
    }
    const course = await courseModel.findById(courseId);
    const { review, rating } = req.body as IAddReviewData;
    const reviewData: any = {
      user: req.user,
      comment: review,
      rating,
    };
    course?.reviews.push(reviewData);
    let avg = 0;
    course?.reviews.forEach((rev: any) => {
      avg += rev.rating;
    });
    if (course) {
      course.ratings = avg / course.reviews.length;
    }
    await course?.save();
    const notification = {
      title: "New Review Received",
      message: `${req.user?.name} has given a review in ${course?.name}`,
    };
    res.status(200).json({
      success: true,
      course,
    });
  })
);

export const addReplyToReview = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { comment, courseId, reviewId } = req.body as IAddReviewReplyData;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }
    const review = course.reviews.find(
      (rev: any) => rev._id.toString() === reviewId.toString()
    );
    if (!review) {
      return next(new ErrorHandler("Review not found", 404));
    }
    const replyData: any = {
      user: req.user,
      comment,
    };
    if (!review.commentReplies) {
      review.commentReplies = [];
    }
    review.commentReplies?.push(replyData);
    await course.save();
    res.status(200).json({
      success: true,
      course,
    });
  })
);

export const getCourses = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const courses = await courseModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      courses,
    });
  })
);

export const deleteCourse = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const course = await courseModel.findById(id);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }
    await course.deleteOne({ id });
    await redis.del(id);
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  })
);
