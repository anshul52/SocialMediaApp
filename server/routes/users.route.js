const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const upload = require("../middlewares/upload");
const {
  getUser,
  uploadPost,
  userPostList,
} = require("../controllers/user.controller");

router.get("/getuser", checkAuth, getUser);

router.post("/postUpload", checkAuth, upload.single("image"), uploadPost);

// user all post
router.get("/posts", checkAuth, userPostList);

module.exports = router;
