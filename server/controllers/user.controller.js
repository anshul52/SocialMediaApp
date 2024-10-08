const db = require("../config/db");

const getUser = (req, res) => {
  const userId = req.params.userId;
  console.log("userId::", userId);
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};
module.exports = {
  // createUser,
  getUser,
  //  loginUser,
  //   loginAdmin
};
