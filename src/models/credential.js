const { Schema, model } = require("mongoose");

const Credential = new Schema({
  userId: { type: Schema.Types.ObjectId },
  accountId: { type: Schema.Types.ObjectId },
  refreshToken: { type: String, default: null },
  accessToken: { type: String, default: null },
  expireOn: { type: String, default: null },
  createdOn: { type: String, default: null },
});

module.exports = model("Credential", Credential, "Credential");
