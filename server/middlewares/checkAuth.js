const { verifyJwtToken } = require("../utils/token.util");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const db = require("../config/db");
const {
  AUTH_HEADER_MISSING_ERR,
  AUTH_TOKEN_MISSING_ERR,
  USER_NOT_FOUND_ERR,
} = require("../config/errors");

const rateLimiter = new RateLimiterMemory({
  points: 15,
  duration: 60,
});

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res
        .status(403)
        .json({ status: 403, message: AUTH_HEADER_MISSING_ERR });
    }
    const token = header.split("Bearer ")[1];
    if (!token) {
      next({ status: 401, message: AUTH_TOKEN_MISSING_ERR });
      return;
    }
    const userId = verifyJwtToken(token, next);
    if (!userId) {
      next({ status: 401, message: JWT_DECODE_ERR });
      return;
    }
    console.log("userId:::", userId);

    try {
      db.query("SELECT * FROM users WHERE id=?", [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        const userid = data[0]?.id;
        req.body.userId = userid;
        return next();
      });
    } catch (error) {}
  } catch (error) {
    next(error);
  }
};
