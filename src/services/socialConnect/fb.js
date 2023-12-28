const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const env = require("../../../env");
const axios = require("axios");

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
        profileFields: ["id", "displayName", "photos", "email"],
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("Here is real data from heaven", profile, accessToken);
        let userObj = {
          accessToken,
          profile,
        };
        return done(null, userObj);
      }
    )
  );
  // Serialize and deserialize user
  fbIni.serializeUser((user, done) => {
    //console.log("user=", user)
    done(null, user);
  });

  fbIni.deserializeUser((obj, done) => {
    done(null, obj);
  });
  return fbIni;
};

const fbFeeds = async (userAccessToken) => {
  checkTokenExpiry(userAccessToken);
  const response = await axios.get(
    `https://graph.facebook.com/me/posts?fields=message,id,picture&access_token=${userAccessToken}`
  );
  return response.data.data;
  // .then((response) => {
  //   const posts = response.data.data;
  //   console.log("posts=", posts)
  //   return posts
  //   // res.redirect("/sendPermissionEmail");
  // })
  // .catch((error) => {
  //   res.status(500).json({ error: "Failed to fetch user posts" });
  // });
};

const checkTokenExpiry = async (userAccessToken) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/debug_token?input_token=${userAccessToken}&access_token=${userAccessToken}`
    );

    const data = response.data;

    if (data && data.data && data.data.is_valid) {
      // Token is valid, check expiration time
      const expiresAt = new Date(data.data.expires_at * 1000); // Convert UNIX timestamp to JavaScript Date
      const currentTime = new Date();
      console.log("expiresAt=", expiresAt);
      if (expiresAt > currentTime) {
        const timeRemaining = expiresAt - currentTime;
        console.log(
          `Token is valid and expires in ${timeRemaining / 1000} seconds.`
        );
      } else {
        console.log("Token has expired.");
      }
    } else {
      console.log("Token is not valid.");
    }
  } catch (error) {
    console.error("Error checking token validity:", error);
  }
};

module.exports = { fbInitialize, fb, fbFeeds };
