import cloudinary from "cloudinary";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import courseModel from "../models/course.model";
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
