import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    // Chỉ hiện stack trace trong môi trường development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
