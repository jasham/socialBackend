const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session = require("express-session");
const env = require("./env");
const app = express();
const dotenv = require("dotenv");
const bizSdk = require("facebook-nodejs-business-sdk");
const routes = require("./src/routes/");

dotenv.config();

app.use(express.json({ limit: "100mb" }))
app.use(
  session({
    secret: env[process.env.NODE_ENV].FB_APP_SECRET_ID,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Configure Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: env[process.env.NODE_ENV].FB_APP_ID,
      clientSecret: env[process.env.NODE_ENV].FB_APP_SECRET_ID,
      callbackURL: "http://localhost:3002/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
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
app.use(routes);

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
