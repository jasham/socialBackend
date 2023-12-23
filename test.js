const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session = require("express-session");
const axios = require("axios");
const nodemailer = require("nodemailer");

const app = express();

// Handle Facebook authentication callback
app.get("/facebook/callback", async (req, res) => {
  const { code } = req.query;

  // Use the code received from Facebook to obtain an access token
  try {
    const response = await axios.get(
      "https://graph.facebook.com/v13.0/oauth/access_token",
      {
        params: {
          client_id: "YOUR_FACEBOOK_APP_ID",
          client_secret: "YOUR_FACEBOOK_APP_SECRET",
          redirect_uri: "http://yourapp.com/facebook/callback",
          code,
        },
      }
    );

    const accessToken = response.data.access_token;
    // Use the access token to access user data or perform actions

    res.send(
      "Authentication successful! Access token received: " + accessToken
    );
  } catch (error) {
    console.error(
      "Error exchanging code for access token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error during authentication");
  }
});

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
      console.log("I am reached here", accessToken);
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
  // if (req.isAuthenticated()) {
  const user = req.user;
  // You can make API requests to fetch user's posts using Axios or any HTTP library
  // Example: Fetch user's posts
  console.log("Teja", access_token);
  axios
    .get(
      `https://graph.facebook.com/me/posts?fields=message,id,picture&access_token=${access_token}`
    )
    .then((response) => {
      console.log("Here is response", response);
      const posts = response.data.data;
      res.json(posts);
      // res.redirect("/sendPermissionEmail");
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

// start email service

const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail', 'hotmail', etc.
  auth: {
    user: "jasham009@gmail.com", //
    pass: "vhqv zqwx owwv wcxy",
  },
});

// Function to send permission request email
const sendPermissionEmail = async (recipientEmail, confirmationLink) => {
  try {
    // Email content
    const mailOptions = {
      from: "jasham009@gmail.com",
      to: recipientEmail,
      subject: "Request for Data Access Permission",
      text: `Dear User,\n\nWe require your permission to access your data in order to provide our services. Please visit the following link to grant access: ${confirmationLink}\n\nThank you,\nYour Company Name`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to generate a confirmation link
const generateConfirmationLink = (accessToken) => {
  // Replace 'http://yourapp.com/confirm_access' with your app's confirmation page
  return `https://www.facebook.com/v13.0/dialog/oauth?client_id=720243843501638redirect_uri=http://localhost:3002&scope=email,picture,feed,comment,location`;
};

// Endpoint to trigger sending permission email
app.get("/sendPermissionEmail", async (req, res) => {
  const userEmailAddress = "tck.shoaib@gmail.com"; // Replace with the user's email address
  console.log("Here is data access_token", access_token);
  try {
    // Use the Facebook Graph API to obtain user access token
    // This part should be integrated into your authentication flow and is just an example here
    // const response = await axios.get("https://graph.facebook.com/v13.0/me", {
    //   params: {
    //     fields: "id",
    //     access_token: access_token, // Replace with the user's access token obtained from the Facebook login flow
    //   },
    // });

    // const userAccessToken = response.data.access_token;
    const confirmationLink = generateConfirmationLink(access_token);

    // Send permission request email with the confirmation link
    await sendPermissionEmail(userEmailAddress, confirmationLink);

    res.send("Permission email sent successfully!");
  } catch (error) {
    console.error(
      "Error obtaining user access token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error sending permission email");
  }
});

// end email service

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
