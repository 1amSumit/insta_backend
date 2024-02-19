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

requestSchema.statics.addRequestToUser = async function (userId) {
  const requestsUserArr = [];
  const requestedUser = await this.find({ recieverUser: userId });

  console.log(requestedUser);

  // requestedUser.map((req) =>
  //   requestsUserArr.push({
  //     requestFromUser: req.senderUser,
  //   })
  // );

  // console.log(requestsUserArr);

  // await User.findByIdAndUpdate(userId, {
  //   requests: requestedUser,
  // });
};

requestSchema.post("save", async function () {
  await this.constructor.addRequestToUser(this.senderUser);
});

requestSchema.index({ senderUser: 1, recieverUser: 1 }, { unique: true });

const Requests = new mongoose.model("Requests", requestSchema);

module.exports = Requests;
