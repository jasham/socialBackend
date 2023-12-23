const con = require("../../helper/db");

const AuthService = {
  async signup(userData) {
    // Implement signup logic, create user in the database
    // Example:
    const user = await con.user.create(userData);
    return user;
  },

  async login({ email, password }) {
    // Implement login logic, validate credentials
    // Example:
    const user = await con.user.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid email or password");
    }

    // Return authenticated user
    return user;
  },
};

module.exports = AuthService;
