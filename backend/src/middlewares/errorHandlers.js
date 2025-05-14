// Not found middleware
export function notFound(req, res, next) {
  const error = new Error(`Path not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// Custom error generator
export const customError = (message, status) => {
  const error = new Error(message);
  error.status = status || 500;
  return error;
};

// Error handling middleware
export function handleError(error, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error?.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : error?.stack,
  });
}