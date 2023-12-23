const { Schema, model } = require("mongoose");

const User = new Schema({
  email: { type: String, default: null },
  password: { type: String, default: null },
  phoneNo: { type: String, default: null },
  name: { type: String, default: null },
  dob: { type: Date, default: null },
  gender: { type: String, default: null },
  imageUrl: { type: String, default: null },
  credentialId: { type: Schema.Types.ObjectId },
  roled: { type: Number },
});

module.exports = model("User", User, "User");
