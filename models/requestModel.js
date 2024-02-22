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

requestSchema.statics.addRequestsUserSent = async function (userId) {
  const sentReq = await this.find({ senderUser: userId });
  const sentReqArr = [];
  sentReq.map((req) => sentReqArr.push(req.recieverUser));

  await User.findOneAndUpdate(
    { username: userId },
    {
      requestSent: sentReqArr,
      numRequestSent: sentReqArr.length,
    }
  );
};

requestSchema.statics.addRequestsUserRecieved = async function (userId) {
  const recRegArr = [];
  const recReq = await this.find({ recieverUser: userId });

  recReq.map((req) => recRegArr.push(req.senderUser));

  await User.findOneAndUpdate(
    { username: userId },
    {
      requestRec: recRegArr,
      numRequestedRec: recRegArr.length,
    }
  );
};

requestSchema.post("save", async function () {
  await this.constructor.addRequestsUserSent(this.senderUser);
  await this.constructor.addRequestsUserRecieved(this.recieverUser);
});

requestSchema.index({ senderUser: 1, recieverUser: 1 }, { unique: true });

const Requests = new mongoose.model("Requests", requestSchema);

module.exports = Requests;
