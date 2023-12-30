const { Schema, model } = require("mongoose");

const Feeds = new Schema({
  socialPlatformPostId: { type: String },
  feedData: { type: String, default: null },
  image: { type: String, default: null },
  createdDate: { type: String, default: null },
  updatedDate: { type: String, default: null },
  userId: { type: Schema.Types.ObjectId },
  accountId: { type: Number },
});

module.exports = model("Feeds", Feeds, "Feeds");
