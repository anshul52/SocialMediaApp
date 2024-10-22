// routes/randomPosts.js
const express = require("express");
const { UserFeedPosts } = require("../controllers/post.controller");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");

// Route to get random posts
router.get("/feed-posts", checkAuth, UserFeedPosts);

module.exports = router;
