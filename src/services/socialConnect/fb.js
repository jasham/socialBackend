const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const env = require("../../../env");

const assignFb = () => {
  return passport;
};

const fbInitialize = () => {
  return assignFb();
};
const fb = (fbIni) => {
  // Serialize and deserialize user
  fbIni.use(
    new FacebookStrategy(
      {
        clientID: env[process.env.NODE_ENV].FB_APP_ID,
        clientSecret: env[process.env.NODE_ENV].FB_APP_SECRET_ID,
        callbackURL: "http://localhost:3002/auth/facebook/callback",
        // callbackURL: "http://localhost:3002/api/v1/credential/test",
        profileFields: ["id", "displayName", "photos", "email"],
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log("index profile", profile);
        // console.log("index refreshToken", refreshToken);
        // console.log("index accessToken", accessToken);
        // Store user details in session or database as needed
        return done(null, profile);
      }
    )
  );
  // Serialize and deserialize user
  fbIni.serializeUser((user, done) => {
    done(null, user);
  });

  fbIni.deserializeUser((obj, done) => {
    done(null, obj);
  });
  return fbIni;
};

module.exports = { fbInitialize, fb };
