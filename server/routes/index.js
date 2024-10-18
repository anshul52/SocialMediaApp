const router = require("express").Router();
const userRoutes = require("../routes/users.route");
const authRoutes = require("../routes/auth.route");
const postRoutes = require("../routes/post.route");
const { BASE_URL } = require("../config/config");

router.get("/", (req, res) => {
  res.send({ "welcome to our socail app!": process.env.BASE_URL });
});

router.use(BASE_URL + "users", userRoutes);
router.use(BASE_URL + "auth", authRoutes);
router.use(BASE_URL + "post", postRoutes);

module.exports = router;
