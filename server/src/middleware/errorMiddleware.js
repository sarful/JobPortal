/**
 * Handle unknown routes.
 */
export const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  res.status(404);
  next(error);
};

/**
 * Global Express error handler.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  let message = err.message || "Internal server error.";

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path || "resource"} ID.`;
  }

  if (err.code === 11000) {
    statusCode = 409;

    const duplicateField = Object.keys(err.keyValue || {})[0];

    message = duplicateField
      ? `${duplicateField} already exists.`
      : "Duplicate resource already exists.";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((validationError) => validationError.message)
      .join(", ");
  }

  if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message =
      err.name === "TokenExpiredError"
        ? "Authentication token has expired."
        : "Invalid authentication token.";
  }

  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};