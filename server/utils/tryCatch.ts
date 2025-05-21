import { NextFunction, Request, RequestHandler, Response } from "express";
import ErrorHandler from "./errorHandler";

const TryCatch = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  };
};

export default TryCatch;
