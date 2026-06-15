const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    message: err.message,
    // Only include the stack trace when explicitly running in development,
    // so an unset/misconfigured NODE_ENV defaults to hiding it.
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = { notFound, errorHandler };
