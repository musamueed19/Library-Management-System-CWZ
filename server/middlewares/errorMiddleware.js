// node.js native class "Error"
/*
class Error{

    // constructor named "message"
    constructor(message) {
        this.message = message;
    }
}

throw new Error(`This is an error message`, 404);
*/

// The native node.js "Error" cannot handle to take statusCode, so, we will extend or create a new class to handle it

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// middleware structure
// export function login(req, res, next) {}

export function errorMiddleware(err, req, res, next) {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    const statusCode = 400;
    const message = "Duplicate Field Value Entered";
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "JsonWebTokenError") {
    const statusCode = 400;
    const message = "Json Web Token is inavlid. Try again.";
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "TokenExpiredError") {
    const statusCode = 400;
    const message = "Json Web Token is expired. Try again.";
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "CastError") {
    const statusCode = 400;
    const message = "Resource not found. Invalid: " + err.path;
    err = new ErrorHandler(message, statusCode);
  }

  // convert array of errors into string of errors
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(", ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
}

export default ErrorHandler;
