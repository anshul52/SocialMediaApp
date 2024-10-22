// controllers/postController.js
const { fetchPostsFeed } = require("../services/postService");
const { AppError } = require("../utils/errorHandler");

const UserFeedPosts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  try {
    const userId = req.body.userId;
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    const posts = await fetchPostsFeed(userId, page, limit);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  UserFeedPosts,
};
