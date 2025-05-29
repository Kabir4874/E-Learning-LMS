import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import { redis } from "../utils/redis";
import TryCatch from "../utils/tryCatch";

export const isAuthenticated = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload | string;

    if (!decoded) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }
    const user = await redis.get((decoded as JwtPayload).id);
    if (!user) {
      return next(
        new ErrorHandler("Please login to access this resource", 404)
      );
    }
    req.user = JSON.parse(user);
    next();
  })
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
