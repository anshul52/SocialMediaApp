const db = require("../config/db");

const getRandomPosts = (limit = 10) => {
  return new Promise((resolve, reject) => {
    console.log("Attempting to fetch maxId from posts");

    // Fetching maxId from posts table
    db.query("SELECT MAX(id) AS maxId FROM posts", (err, maxIdResult) => {
      if (err) {
        console.error("Error fetching maxId:", err.stack);
        return reject({ error: "Internal server error", details: err.message });
      }

      const maxId = maxIdResult[0]?.maxId;
      console.log("maxId::::", maxId);

      // If maxId is null or undefined, there are no posts in the table
      if (!maxId) {
        console.log("No posts found, returning an empty array.");
        return resolve({ message: "No posts available" });
      }

      console.log(
        `Fetching random posts where id >= FLOOR(1 + RAND() * ${maxId}) with limit ${limit}`
      );

      // Querying random posts based on the calculated random id
      db.query(
        `SELECT * FROM posts WHERE id >= FLOOR(1 + RAND() * ?) LIMIT ?;`,
        [maxId, limit],
        (error, posts) => {
          if (error) {
            console.error("Error fetching random posts:", error.stack);
            return reject({
              error: "Internal server error",
              details: error.message,
            });
          }

          if (posts.length === 0) {
            return resolve({ message: "No posts available" });
          }

          return resolve(posts);
        }
      );
    });
  });
};

module.exports = {
  getRandomPosts,
};
