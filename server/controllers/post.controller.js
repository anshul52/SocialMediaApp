// controllers/postController.js
const { getRandomPosts } = require("../services/postService");

const fetchRandomPosts = async (req, res) => {
  try {
    const posts = await getRandomPosts(10);

    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "No posts available" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  fetchRandomPosts,
};
