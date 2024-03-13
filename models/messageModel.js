const mongoose = require("mongoose");
const User = require("./userModel");

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requried: [true, "Every message should have sender."],
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Every message should have reciever."],
  },
  message: {
    type: String,
    default: "",
    required: [true, "EMessage should be present to send message."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
