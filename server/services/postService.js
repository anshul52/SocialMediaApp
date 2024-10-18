// services/postService.js
const db = require("../config/db");

const getRandomPosts = async (limit = 10) => {
  try {
    const [maxIdResult] = await db.query("SELECT MAX(id) AS maxId FROM posts");
    const maxId = maxIdResult[0].maxId;

    if (!maxId) {
      return [];
    }

    // Efficient query to fetch 10 random posts in one query
    const [posts] = await db.query(
      `
      SELECT * FROM posts
      WHERE id >= FLOOR(1 + RAND() * ?)
      LIMIT ?;
    `,
      [maxId, limit]
    );

    return posts;
  } catch (error) {
    console.error("Error fetching random posts:", error);
    throw new Error("Database error");
  }
};

module.exports = {
  getRandomPosts,
};
