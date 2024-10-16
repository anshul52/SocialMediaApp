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
  // const filePath = `/resources/uploads/${originalname}`;
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

const uplaodProfileImage = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id || !req.file) {
    return res.status(400).json({ error: "Missing required fields or file." });
  }

  const id = user_id;
  const { originalname } = req.file;
  const relativeFilePath = `${req.file.filename}`;

  try {
    // First, check if the user exists in the database
    const userExists = await new Promise((resolve, reject) => {
      const checkQuery = `SELECT COUNT(*) AS count FROM users WHERE id = ?`;
      db.query(checkQuery, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result[0].count > 0); // Check if count is greater than 0
      });
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    // If the user exists, update the profile picture information
    const query = `UPDATE users SET profilePic_name = ?, profilePic_path = ? WHERE id = ?`;
    const values = [originalname, relativeFilePath, id];

    const result = await new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    res.status(200).json({
      message: "Profile image updated successfully!",
      profileData: {
        id,
        profile_name: originalname,
        profile_path: relativeFilePath,
      },
    });
  } catch (err) {
    console.error("Error updating profile image:", err);

    return res
      .status(500)
      .json({ error: "Database operation failed. Please try again later." });
  }
};

module.exports = {
  getUser,
  uploadPost,
  userPostList,
  uplaodProfileImage,
};
