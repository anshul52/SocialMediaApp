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

const uploadPost = async (req, res) => {
  const { user_id, post_description } = req.body;

  if (!user_id || !post_description || !req.file) {
    return res.status(400).json({ error: "Missing required fields or file." });
  }

  const { originalname } = req.file;
  const filePath = `/resources/uploads/${originalname}`;
  const relativeFilePath = `${req.file.filename}`;
  const query = `
    INSERT INTO posts (user_id, post_description, img_name, img_path)
    VALUES (?, ?, ?, ?)
  `;

  const values = [user_id, post_description, originalname, relativeFilePath];

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    res.status(201).json({
      message: "Post uploaded successfully",
      postId: result.insertId,
      postData: {
        user_id,
        post_description,
        img_name: originalname,
        img_path: relativeFilePath,
      },
    });
  } catch (err) {
    console.error("Error inserting into database:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Duplicate entry for user ID." });
    }

    return res
      .status(500)
      .json({ error: "Database insertion failed. Please try again later." });
  }
};

const userPostList = async (req, res) => {
  const userId = req.query.user_id;

  let query = "SELECT * FROM posts";
  const values = [];

  if (userId) {
    query += " WHERE user_id = ?";
    values.push(userId);
  }

  query += " ORDER BY user_id";

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ error: "Failed to fetch posts." });
    }

    res.status(200).json(results);
  });
};

module.exports = {
  getUser,
  uploadPost,
  userPostList,
};
