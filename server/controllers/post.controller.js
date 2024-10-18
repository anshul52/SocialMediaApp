// controllers/postController.js
const postService = require("../services/postService");

const fetchRandomPosts = async (req, res) => {
  try {
    const posts = await postService.getRandomPosts(10); // Fetch 10 random posts
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
