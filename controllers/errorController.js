const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //Render
  return res.status(err.statusCode).render("error", {
    title: "Erro Occured",
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }

  //Render Error
  //A) Operational error
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Error Occured",
      msg: err.message,
    });
  }
  //B)Programming or other unknown Error
  return res.status(err.statusCode).render("error", {
    title: "Error Occured",
    msg: "Please try again later",
  });
};

const handleErrorCastIDDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const message = `Duplicate Name field value. ${err.keyValue.name} already Exists.`;
  return new AppError(message, 400);
};

const handleValidatorError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJwtToken = () => new AppError("Invalid token , pLease Login again");

const handleJwtTokenExpired = () =>
  new AppError("Token Expired, pLease Login again");

exports.errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV !== "production") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleErrorCastIDDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === "ValidationError") error = handleValidatorError(error);
    if (error.name === "JsonWebTokenError") error = handleJwtToken();
    if (error.name === "TokenExpiredError") error = handleJwtTokenExpired();

    sendErrorProd(error, req, res);
  }
};
