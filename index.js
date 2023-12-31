const express = require("express");
const session = require("express-session");
const env = require("./env");
const app = express();
const dotenv = require("dotenv");
const routes = require("./src/routes/");
const { fbInitialize, fb } = require("./src/services/socialConnect/fb");
const cors = require("cors");
const { default: axios } = require("axios");
const crypto = require("crypto");

dotenv.config();
app.use(cors());

app.use(express.json({ limit: "100mb" }));
app.use(
  session({
    secret: env[process.env.NODE_ENV].FB_APP_SECRET_ID,
    resave: true,
    saveUninitialized: true,
  })
);

const passport = fbInitialize();

app.use(passport.initialize());
app.use(passport.session());
const fbIni = fb(passport);

app.use(routes);

// app.get("/auth/facebook/callback",
//   fbIni.authenticate("facebook", {
//     successRedirect: "/api/v1/credential",
//     failureRedirect: "/",
//   })
// );

app.get("/auth/facebook", function (req, res, next) {
  const state = { userId: req.query.userId }; // Generate a unique state value
  // console.log("Here is query from 1678", req.query);
  req.session.customData = state; // Store it in the session

  passport.authenticate("facebook", {
    scope: ["email", "user_posts", "user_photos", "user_likes"],
  })(req, res, next);
});
app.get("/auth/facebook/callback", (req, res, next) => {
  // Access query parameters here
  // console.log("query", req.query);
  // const { queryParam1, queryParam2 } = req.query;

  // Perform any operations with query parameters if needed

  // Call passport.authenticate with Facebook strategy
  passport.authenticate("facebook", {
    successRedirect: "/api/v1/credential",
    failureRedirect: "/",
  })(req, res, next); // Call authenticate middleware
});
// app.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/login" }),
//   function (req, res) {
//     console.log("Here is query", req.query);
//     passport.authenticate("facebook", {
//       successRedirect: "/api/v1/credential",
//       failureRedirect: "/",
//     })(req, res, next); // Call authenticate middleware

//     // Successful authentication
//     res.redirect("http://localhost:3000/feeds");
//   }
// );
// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
