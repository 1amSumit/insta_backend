const mongoose = require("mongoose");
const User = require("./userModel");

const requestSchema = mongoose.Schema(
  {
    senderUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recieverUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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

requestSchema.statics.addRequestsToUser = async function (userId) {
  const recieveRequest = await this.find({ recieverUser: userId });
  const recieveReqArr = [];
  recieveRequest.map((req) => recieveReqArr.push(req.senderUser));

  await User.findByIdAndUpdate(userId, {
    requests: recieveReqArr,
    numRequests: recieveReqArr.length,
  });
};

requestSchema.statics.addRequestedToUser = async function (userId) {
  const requestedUserArr = [];
  const requestedUser = await this.find({ senderUser: userId });

  requestedUser.map((req) => requestedUserArr.push(req.recieverUser));

  await User.findByIdAndUpdate(userId, {
    requested: requestedUserArr,
    numRequested: requestedUserArr.length,
  });
};

requestSchema.post("save", async function () {
  await this.constructor.addRequestedToUser(this.senderUser);
  await this.constructor.addRequestsToUser(this.recieverUser);
});

requestSchema.index({ senderUser: 1, recieverUser: 1 }, { unique: true });

const Requests = new mongoose.model("Requests", requestSchema);

module.exports = Requests;
