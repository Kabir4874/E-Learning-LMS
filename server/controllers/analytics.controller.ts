import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import courseModel from "../models/course.model";
import orderModel from "../models/order.model";
import userModel from "../models/user.model";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import TryCatch from "../utils/tryCatch";

export const getUserAnalytics = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const users = await generateLast12MonthsData(userModel);
    res.status(200).json({
      success: true,
      users,
    });
  })
);

export const getCourseAnalytics = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const courses = await generateLast12MonthsData(courseModel);
    res.status(200).json({
      success: true,
      courses,
    });
  })
);

export const getOrderAnalytics = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const orders = await generateLast12MonthsData(orderModel);
    res.status(200).json({
      success: true,
      orders,
    });
  })
);
