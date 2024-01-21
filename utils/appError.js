class AppError extends Error {
  constructor(messaage, statusCode) {
    super(messaage);
    this.statusCode = statusCode;

    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
