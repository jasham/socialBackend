const jwt = require("jsonwebtoken");

function generateToken(userId) {
  const token = jwt.sign({ userId }, "your_secret_key", { expiresIn: "1h" });
  // 'your_secret_key' should be replaced with a secure secret key for signing the token
  // 'expiresIn' sets the expiration time for the token (e.g., 1 hour)
  return token;
}

function decodeToken(token) {
  const decode = jwt.decode(token);
  console.log("decode=", decode)
  // 'your_secret_key' should be replaced with a secure secret key for signing the token
  // 'expiresIn' sets the expiration time for the token (e.g., 1 hour)
  return decode;
}

module.exports = {
  generateToken,
  decodeToken
};
