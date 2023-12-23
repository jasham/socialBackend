const { Schema, model } = require("mongoose");

const AccountType = new Schema({
  accountName: { type: String, default: null },
});

module.exports = model("AccountType", AccountType, "AccountType");
