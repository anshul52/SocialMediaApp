const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");

exports.createJwtToken = (payload) => {
  console.log("JWT_SECRET::", JWT_SECRET);
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return token;
};

exports.verifyJwtToken = (token, next) => {
  try {
    const user = jwt.verify(token, JWT_SECRET);
    console.log("user", user);
    return user._id;
  } catch (err) {
    next({ status: 401, message: JWT_EXPIRED_ERR });
  }
};
