import cloudinary from "cloudinary";
import { Types } from "mongoose";
import { IUpdateUserInfo } from "../interfaces/user.interface";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import { redis } from "../utils/redis";
import TryCatch from "../utils/tryCatch";
require("dotenv").config();

export const getUserInfo = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const userId = req.user?._id;
    const data = await redis.get(userId as string);

    let user;
    if (data) {
      user = JSON.parse(data);
    }

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    res.status(201).json({
      success: true,
      user,
    });
  })
);

export const updateUserInfo = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { email, name } = req.body as IUpdateUserInfo;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);
    if (email && user) {
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      user.email = email;
    }
    if (name && user) {
      user.name = name;
    }
    await user?.save();

    if (userId instanceof Types.ObjectId) {
      redis.set(userId.toString(), JSON.stringify(user));
    } else {
      console.error("userId is not an ObjectId");
    }
    res.status(201).json({
      success: true,
      user,
    });
  })
);

export const updateProfilePicture = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { avatar } = req.body;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (avatar && user) {
      if (user?.avatar.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "LMS_Avatars",
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "LMS_Avatars",
        });
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    } else {
      return next(new ErrorHandler("Please provide avatar", 400));
    }
    await user.save();
    if (userId instanceof Types.ObjectId) {
      redis.set(userId.toString(), JSON.stringify(user));
    } else {
      console.error("userId is not an ObjectId");
    }
    res.status(201).json({
      success: true,
      user,
    });
  })
);

export const getAllUser = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const users = await userModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      users,
    });
  })
);

export const updateUserRole = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { id, role } = req.body;
    const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
    res.status(201).json({
      success: true,
      user,
    });
  })
);

export const deleteUser = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    await user.deleteOne({ id });
    await redis.del(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  })
);
