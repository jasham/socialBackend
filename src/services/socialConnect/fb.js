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
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) => {
        // console.log("Here is real data from heaven", req.session);
        let userObj = {
          accessToken,
          profile,
          userCustomData: req.session.customData
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

const fbFeeds = async (userAccessToken, validityStatus) => {
  let flag = false
  if (!!validityStatus && validityStatus === "valid") {
    flag = true
  }
  else {
    validityStatus = this.checkAccessTokenExpiry(userAccessToken);
    if (validityStatus === "valid")
      flag = true
  }
  if (flag) {
    const response = await axios.get(
      `https://graph.facebook.com/me/posts?fields=message,id,picture,updated_time,created_time&access_token=${userAccessToken}`
    );
    return response.data.data;
  }
  return null
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

const checkAccessTokenExpiry = async (userAccessToken) => {
  try {
    let obj = { createdOn: null, expireOn: null, status: "fail" };

    const response = await axios.get(
      `https://graph.facebook.com/debug_token?input_token=${userAccessToken}&access_token=${userAccessToken}`
    );

    const data = response.data;

    if (data && data.data && data.data.is_valid) {
      // Token is valid, check expiration time
      const currentTime = new Date();
      obj.createdOn = currentTime;
      console.log("currentTime=", currentTime);

      const expiresIn = data.data.expires_at * 1000;
      obj.expireOn = new Date(expiresIn); // Convert UNIX timestamp to JavaScript Date
      console.log("expiresAt=", obj.expireOn);

      if (obj.expireOn > currentTime) {
        obj.status = "valid";
      } else {
        obj.status = "expired";
      }
    } else {
      // Handle invalid token
      obj.status = "invalid";
    }

    return obj;
  } catch (error) {
    console.error("Error checking token validity:", error);
    throw error; // Propagate the error if needed
  }
};

module.exports = { fbInitialize, fb, fbFeeds, checkAccessTokenExpiry };
