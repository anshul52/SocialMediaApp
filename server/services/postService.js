const db = require("../config/db");

const getRandomPosts = async (limit = 10) => {
  try {
    console.log("Attempting to fetch maxId from posts");

    const [maxIdResult] = await db.query("SELECT MAX(id) AS maxId FROM posts");
    console.log("maxIdResult:", maxIdResult);

    const maxId = maxIdResult[0]?.maxId;
    console.log("maxId::::", maxId);

    if (!maxId) {
      console.log("No posts found, returning an empty array.");
      return [];
    }

    console.log(
      `Fetching random posts where id >= FLOOR(1 + RAND() * ${maxId}) with limit ${limit}`
    );

    const [posts] = await db.query(
      `SELECT * FROM posts WHERE id >= FLOOR(1 + RAND() * ?) LIMIT ?;`,
      [maxId, limit]
    );

    console.log("Posts fetched:", posts);
    return posts;
  } catch (error) {
    console.error("Full error object:", error);
    throw new Error("Database error");
  }
};

module.exports = {
  getRandomPosts,
};
