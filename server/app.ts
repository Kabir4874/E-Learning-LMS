import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { ErrorMiddleware } from "./middlewares/error";
import analyticsRoutes from "./routes/analytics.route";
import authRoutes from "./routes/auth.route";
import courseRoutes from "./routes/course.route";
import layoutRoutes from "./routes/layout.route";
import notificationRoutes from "./routes/notification.route";
import orderRoutes from "./routes/order.route";
import userRoutes from "./routes/user.route";
require("dotenv").config();
export const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/layout", layoutRoutes);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Server is working",
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
