const express = require("express");
const session = require("express-session");
const env = require("./env");
const app = express();
const dotenv = require("dotenv");
const routes = require("./src/routes/");
const { fbInitialize, fb } = require("./src/services/socialConnect/fb");
const cors = require("cors");

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

app.get(
  "/auth/facebook/callback",
  fbIni.authenticate("facebook", {
    successRedirect: "/api/v1/credential",
    failureRedirect: "/",
  })
);
// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
