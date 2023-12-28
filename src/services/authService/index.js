const con = require("../../helper/db");
const { generateToken, decodeToken } = require("../../helper/token");
const nodemailer = require("nodemailer");

const AuthService = {
  async signup(userData) {
    // Check if the user already exists
    const existingUser = await con.user.findOne({ email: userData.email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // If the user doesn't exist, create a new user
    const newUser = await con.user.create(userData);
    return newUser;
  },

  async login({ email, password }) {
    // Find the user by their email
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await con.user.findOne({ email });
    console.log("Here is user", user);
    if (!user) {
      throw new Error("User not found");
    }

    // Compare the provided password with the stored password hash
    // This is a placeholder for your actual password comparison logic
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    console.log("Email and password are", user._id);
    // If the email and password match, return the authenticated user
    const token = generateToken(user._id);
    return { token, user };
  },

  async decode(token) {
    const decode = decodeToken(token.token);
    return { decode };
  },

  async userInvitaion(data) {
    console.log("Here is user email", data);
    const transporter = nodemailer.createTransport({
      service: "gmail", // e.g., 'gmail', 'hotmail', etc.
      auth: {
        user: "jasham009@gmail.com", //
        pass: "vhqv zqwx owwv wcxy",
      },
    });
    const confirmationLink = `=http://localhost:3000/signup`;
    try {
      // Email content
      const mailOptions = {
        from: "jasham009@gmail.com",
        to: data.email,
        subject: "Request for Data Access Permission",
        text: `Dear User,\n\nWe require your permission to access your data in order to provide our services. Please visit the following link to grant access: ${confirmationLink}\n\nThank you,\nYour Company Name`,
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  },
};

module.exports = AuthService;
