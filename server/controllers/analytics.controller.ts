import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
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
