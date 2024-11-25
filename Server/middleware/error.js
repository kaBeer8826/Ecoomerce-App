const ErrorHandler = require("../utils/ErrorHandler");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";
  console.error("Error details:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  if (err.name === "CastError") {
    const message = "resouces not found with the this id .. Inavild  ";
    err = new ErrorHandler(message, 400);
  }
  //duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate Key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwr token
  if ((err.name = "JsonWebTokenError")) {
    const message = `URL is invalid please try again`;
    err = new ErrorHandler(message, 400);
  }
  //jwt expired
  if (err.name === "TokenExpiredError") {
    const message = `Your Url is expired please try again letter!`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
