// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error wrapper for async functions
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Response helper
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Success response
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

// Error response
const sendError = (res, message, statusCode = 500) => {
  return sendResponse(res, statusCode, false, message);
};

module.exports = {
  AppError,
  catchAsync,
  sendResponse,
  sendSuccess,
  sendError
};
