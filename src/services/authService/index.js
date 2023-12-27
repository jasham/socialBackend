const con = require("../../helper/db");
const { generateToken, decodeToken } = require("../../helper/token");

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
    return { token };
  },

  async decode(token) {
    const decode = decodeToken(token.token);
    return { decode };
  },
};

module.exports = AuthService;
