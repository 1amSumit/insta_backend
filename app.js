const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/usersRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const errorController = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();
app.use(cors());

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests with this IP, please try again in an hour.",
});
app.use("/api", limiter);

app.use(express.json({ limit: "2mb" }));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRoutes);

// app.options('*', cors());
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//express middleware for error handling
app.use(errorController.errorHandler);

module.exports = app;
