const { createMessage } = require("./controllers/mssageControllers");
const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const socketIo = require("socket.io");

const server = () => {
  process.on("uncaughtException", (error) => {
    console.log(error.name, error.message);
    process.exit(1);
  });

  dotenv.config({ path: "./config.env" });

  const DB = process.env.DATA_BASE;

  mongoose.connect(DB).then(() => {
    console.log("DB connection established");
  });

  const PORT = process.env.PORT || 5500;

  const serverInstance = app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
  });

  const io = socketIo(serverInstance, {
    cors: {
      origin: ["http://localhost:5173", "https://insta-sumit.vercel.app"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-room", (room) => {
      socket.join(room);
    });

    socket.on("send-message", (message, room) => {
      socket.to(room).emit("receive-message", message);
      createMessage(message);
    });
  });

  process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    serverInstance.close(() => {
      process.exit(1);
    });
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM recieved Shutting down gracefully");
    serverInstance.close(() => {
      console.log("Process terminated");
    });
  });
};

server();

module.exports = server;

// const io = require("socket.io")(3000, {
//   cors: {
//     origin: ["http://localhost:5173", "https://insta-sumit.vercel.app"],
//   },
// });
