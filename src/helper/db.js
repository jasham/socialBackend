const { connect, connection } = require("mongoose");

connect("mongodb://127.0.0.1:27017/TCP")
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

const main = (req, res, next) => {
  if (connection.readyState === 0) {
    return res
      .status(503)
      .json({ result: "dbFailed", error: "DB connection issue" });
  } else if (connection.readyState === 1) {
    next();
  } else {
    return res
      .status(503)
      .json({ result: "dbProcessing", error: "DB connection issue" });
  }
};

module.exports = {
  main,
  user: require("../models/user"),
};
