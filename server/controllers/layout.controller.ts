import cloudinary from "cloudinary";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors";
import layoutModel from "../models/layout.model";
import ErrorHandler from "../utils/errorHandler";
import TryCatch from "../utils/tryCatch";
export const createLayout = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { type } = req.body;
    const isTypeExist = await layoutModel.findOne({ type });
    if (isTypeExist) {
      return next(new ErrorHandler(`${type} already exist`, 400));
    }
    if (type === "Banner") {
      const { image, title, subTitle } = req.body;
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "LMS_Layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subTitle,
      };
      await layoutModel.create({ type: "Banner", banner });
    }
    if (type === "FAQ") {
      const { faq } = req.body;
      const faqItems = await Promise.all(
        faq.map(async (item: any) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        })
      );
      await layoutModel.create({ type: "FAQ", faq: faqItems });
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoryItems = await Promise.all(
        categories.map(async (item: any) => {
          return {
            title: item.title,
          };
        })
      );
      await layoutModel.create({
        type: "Categories",
        categories: categoryItems,
      });
    }
    res.status(200).json({
      success: true,
      message: "Layout created successfully",
    });
  })
);

export const editLayout = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const { type } = req.body;
    const data = await layoutModel.findOne({ type });
    if (type === "Banner") {
      const { image, title, subTitle } = req.body;
      if (data) {
        await cloudinary.v2.uploader.destroy(data?.banner.image.public_id);
      }
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "LMS_Layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subTitle,
      };
      await layoutModel.findByIdAndUpdate(data?._id, { banner });
    }
    if (type === "FAQ") {
      const { faq } = req.body;
      const faqItems = await Promise.all(
        faq.map(async (item: any) => {
          return {
            question: item.question,
            answer: item.answer,
          };
        })
      );
      await layoutModel.findByIdAndUpdate(data?._id, { faq: faqItems });
    }
    if (type === "Categories") {
      const { categories } = req.body;
      const categoryItems = await Promise.all(
        categories.map(async (item: any) => {
          return {
            title: item.title,
          };
        })
      );
      await layoutModel.findByIdAndUpdate(data?._id, {
        categories: categoryItems,
      });
    }
    res.status(200).json({
      success: true,
      message: "Layout updated successfully",
    });
  })
);

export const getLayoutByType = CatchAsyncError(
  TryCatch(async (req, res, next) => {
    const layout = await layoutModel.findOne({ type: req.body.type });
    res.status(201).json({
      success: true,
      layout,
    });
  })
);
