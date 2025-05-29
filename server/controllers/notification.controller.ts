import cron from "node-cron";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import notificationModel from "../models/notification.model";
import ErrorHandler from "../utils/errorHandler";
import TryCatch from "../utils/tryCatch";
export const getNotifications = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const notifications = await notificationModel
      .find()
      .sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      notifications,
    });
  })
);

export const updateNotification = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const notification = await notificationModel.findById(req.params.id);
    if (!notification) {
      return next(new ErrorHandler("Notification not found", 404));
    } else {
      notification.status
        ? (notification.status = "read")
        : notification?.status;
    }
    await notification.save();
    const notifications = await notificationModel
      .find()
      .sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      notifications,
    });
  })
);

cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await notificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
  console.log("Deleted read notifications");
});
