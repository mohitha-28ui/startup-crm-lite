/**
 * Global Express error handling middleware.
 * Intercepts errors thrown during request processing and formats them
 * into standardized, user-friendly JSON responses.
 * 
 * @param {Object} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Next middleware function.
 * @returns {Object} Express error response.
 */
export const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = 500;
  let message = "Server error";
  let errors = null;

  // 1. Mongoose ValidationError -> 400 status with field-by-field messages
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Failed";
    errors = Object.keys(err.errors).reduce((acc, field) => {
      acc[field] = err.errors[field].message;
      return acc;
    }, {});
  }
  // 2. Mongoose CastError (invalid ObjectId) -> 404 status
  else if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }
  // 3. MongoDB Duplicate Key Error (code 11000) -> 409 status
  else if (err.code === 11000) {
    statusCode = 409;
    message = "Email already exists";
  }
  // 4. JWT errors (JsonWebTokenError, TokenExpiredError) -> 401 status
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token, authorization denied";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired, authorization denied";
  }
  // If the error has a custom status code already defined
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message || message;
  }

  // Determine environment
  const isDev = process.env.NODE_ENV !== "production";

  // Build standard error response body
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
    // Include stack trace in response only during development
    ...(isDev && { stack: err.stack }),
  };

  return res.status(statusCode).json(response);
};

export default errorHandler;
