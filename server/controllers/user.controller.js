const db = require("../config/db");

const getUser = (req, res) => {
  const { userId } = req.body;
  console.log("userId::", userId);
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error", error: err });
    }

    if (data.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...userInfo } = data[0];

    return res.status(200).json({ status: true, data: userInfo });
  });
};
module.exports = {
  getUser,
};
