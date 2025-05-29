import { IOrder } from "../interfaces/order.interface";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import courseModel from "../models/course.model";
import notificationModel from "../models/notification.model";
import orderModel from "../models/order.model";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import sendEmail from "../utils/mail";
import TryCatch from "../utils/tryCatch";

export const createOrder = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { courseId, payment_info } = req.body as IOrder;
    const user = await userModel.findById(req.user._id);
    const courseExistInUser = user?.courses.some(
      (course: any) => course.courseId.toString() === courseId
    );
    if (courseExistInUser) {
      return next(
        new ErrorHandler("You have already purchased this course", 400)
      );
    }
    const course = await courseModel.findById(courseId);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }
    const data: any = {
      courseId: course._id,
      userId: user?._id,
      payment_info,
    };
    await orderModel.create(data);
    course.purchased ? (course.purchased += 1) : (course.purchased = 1);
    const mailData: any = {
      order: {
        _id: course._id.toString().slice(0, 6),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };
    try {
      if (user) {
        await sendEmail({
          email: user.email,
          subject: "Order Confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
    user?.courses.push({ courseId });
    await user?.save();
    await course.save();
    await notificationModel.create({
      userId: user?._id,
      title: "New Order",
      message: `You have a new order from ${course.name}`,
    });
    res.status(201).json({
      success: true,
      order: course,
    });
  })
);

export const getAllOrders = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const orders = await orderModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders,
    });
  })
);
