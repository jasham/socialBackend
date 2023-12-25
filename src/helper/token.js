const jwt = require("jsonwebtoken");

function generateToken(userId) {
  const token = jwt.sign({ userId }, "your_secret_key", { expiresIn: "1h" });
  // 'your_secret_key' should be replaced with a secure secret key for signing the token
  // 'expiresIn' sets the expiration time for the token (e.g., 1 hour)

  return token;
}

module.exports = {
  generateToken,
};
