const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/usersRoutes");
const postRouter = require("./routes/postRoutes");

const app = express();
app.use(cors());

const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests with this IP, please try again in an hour.",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10mb" }));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRouter);

app.get("/api", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hallo from server",
  });
});

module.exports = app;
