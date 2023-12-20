const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session = require("express-session");
const axios = require("axios");

const app = express();

// Configure Passport to use session
app.use(
  session({
    secret: "f0b9bad4eb31173923e05f2d09ece117",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
let access_token = "";
// Configure Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: "720243843501638",
      clientSecret: "f0b9bad4eb31173923e05f2d09ece117",
      callbackURL: "http://localhost:3002/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("I am reached here");
      access_token = accessToken;
      // Store user details in session or database as needed
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Facebook Graph API Example");
});

// Facebook authentication route
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);

// Profile route (after successful authentication)
app.get("/profile", (req, res) => {
  console.log("Here is data", req.isAuthenticated());
  // if (req.isAuthenticated()) {
  const user = req.user;
  // You can make API requests to fetch user's posts using Axios or any HTTP library
  // Example: Fetch user's posts
  console.log("Teja", access_token);
  axios
    .get(
      `https://graph.facebook.com/me/posts?fields=message,id,picture&access_token=${access_token}`,
      {}
    )
    .then((response) => {
      console.log("Here is response", response);
      const posts = response.data.data;
      res.json(posts);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch user posts" });
    });
  // } else {
  //   res.redirect("/");
  // res.send(200);
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
