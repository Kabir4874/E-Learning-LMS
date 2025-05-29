import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Types } from "mongoose";
import {
  IActivationRequest,
  IActivationToken,
  ILoginRequest,
  IRegistrationBody,
  ISocialAuthBody,
  IUpdatePassword,
} from "../interfaces/auth.interface";
import { IUser } from "../interfaces/user.interface";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import sendEmail from "../utils/mail";
import { redis } from "../utils/redis";
import TryCatch from "../utils/tryCatch";
require("dotenv").config();

export const createActivationToken = (
  user: IRegistrationBody
): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 900).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );
  return { token, activationCode };
};

export const registrationUser = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { name, email, password } = req.body;

    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist", 400));
    }
    const user: IRegistrationBody = { name, email, password };
    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;
    const data = { user: { name: user.name }, activationCode };
    try {
      await sendEmail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account!`,
        activationToken: activationToken.token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

export const activateUser = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { activation_code, activation_token } =
      req.body as IActivationRequest;
    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET as string
    ) as { user: IUser; activationCode: string };
    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }
    const { email, name, password } = newUser.user;
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }
    const user = await userModel.create({ name, email, password });
    res.status(201).json({
      success: true,
      user,
    });
  })
);

export const loginUser = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { email, password } = req.body as ILoginRequest;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendToken(user, 200, res);
  })
);

export const logoutUser = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });
    if (req.user?._id) {
      redis.del(req.user._id.toString());
    } else {
      console.error("User ID not found or invalid");
    }

    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  })
);

export const updateAccessToken = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const refresh_token = req.cookies.refresh_token;
    const decoded = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN as string
    ) as JwtPayload;

    const message = "Please login to access this resource";
    if (!decoded) {
      return next(new ErrorHandler(message, 400));
    }
    const session = await redis.get((decoded as JwtPayload).id);
    if (!session) {
      return next(new ErrorHandler(message, 400));
    }
    const user = JSON.parse(session);

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN as string,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN as string,
      { expiresIn: "3d" }
    );

    req.user = user;

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    await redis.set(user._id, JSON.stringify(user), "EX", 604800);
    res.status(200).json({
      success: true,
      accessToken,
    });
  })
);

export const socialAuth = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { email, name, avatar } = req.body as ISocialAuthBody;
    const user = await userModel.findOne({ email });
    if (!user) {
      const newUser = await userModel.create({ email, name, avatar });
      sendToken(newUser, 200, res);
    } else {
      sendToken(user, 200, res);
    }
  })
);

export const updatePassword = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body as IUpdatePassword;
    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("Please enter old and new password", 400));
    }
    const userId = req.user?._id;
    const user = await userModel.findById(userId).select("+password");
    console.log(user, "user");
    if (user?.password === undefined) {
      return next(new ErrorHandler("Invalid user", 400));
    }
    const isPasswordMatched = await user?.comparePassword(oldPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid old password", 400));
    }
    user.password = newPassword;
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
