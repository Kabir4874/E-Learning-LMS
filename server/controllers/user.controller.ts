import jwt, { Secret } from "jsonwebtoken";
import {
  IActivationRequest,
  IActivationToken,
  IRegistrationBody,
} from "../interfaces/user.interface";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import sendEmail from "../utils/mail";
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
