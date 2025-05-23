import cloudinary from "cloudinary";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import courseModel from "../models/course.model";
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
