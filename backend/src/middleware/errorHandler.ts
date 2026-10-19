import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Unhandled Error:", err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(status).json({
    status: "error",
    statusCode: status,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
