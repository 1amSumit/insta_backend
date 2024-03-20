const server = () => {
  const app = require("./app");
  const dotenv = require("dotenv");
  const mongoose = require("mongoose");

  process.on("uncaughtException", (error) => {
    console.log(error.name, error.message);
    process.exit(1);
  });

  if (process.env.NODE_ENV === "development") {
    dotenv.config({ path: "./config.env" });
  }

  const DB = process.env.DATA_BASE;

  mongoose.connect(DB).then(() => {
    console.log("DB connection established");
  });

  const PORT = process.env.PORT || 5500;
  app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
  });

  process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM recieved Shutting down gracefully");
    server.close(() => {
      console.log("Process terminated");
    });
  });
};

server();

module.exports = server;
