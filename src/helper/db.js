const { connect, connection } = require("mongoose");


connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TCP", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // other options if needed
})
  .then(() => {
    console.log("DB connected");
    // ... your code after successful connection
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
    // Handle the error appropriately
  });
// connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TCP", {
//   useNewUrlParser: true,
//   // useUnifiedTopology: true,
//   // useCreateIndex: true,
// })
//   .then(() => {
//     console.log("db connected");
//   })
//   .catch((err) => {
//     console.log(err, "hello 1998");
//   });

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
  User: require("../models/user"),
};
