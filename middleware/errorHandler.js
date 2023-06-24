const AppError = require('./../utils/AppError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.msg
    });
  }
  res.status(400).json({
    status: "error",
    message: err.message,
  });
};
module.exports = errorHandler;
