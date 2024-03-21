const mongoose = require("mongoose");
const User = require("./userModel");

const requestSchema = mongoose.Schema(
  {
    senderUser: {
      type: String,
    },
    recieverUser: {
      type: String,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

requestSchema.index({ senderUser: 1, recieverUser: 1 }, { unique: true });

const Requests = new mongoose.model("Requests", requestSchema);

module.exports = Requests;
