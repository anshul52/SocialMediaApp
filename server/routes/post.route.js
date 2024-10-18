// routes/randomPosts.js
const express = require("express");
const { fetchRandomPosts } = require("../controllers/post.controller");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");

// Route to get random posts
router.get("/random-posts", checkAuth, fetchRandomPosts);

module.exports = router;
