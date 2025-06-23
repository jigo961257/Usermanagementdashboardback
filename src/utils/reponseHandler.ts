import { Response } from "express";

export const successResponse = (res: any, message: string, data: any = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    status: true,
    message,
    data,
  });
};

export const errorResponse = (res: Response, message: string, statusCode = 400) => {
  return res.status(statusCode).json({
    status: false,
    message,
  });
};
