const router = require("express").Router();
const userRoutes = require("../routes/users.route");
const { BASE_URL } = require("../config/config");
router.get("/", (req, res) => {
  res.send({ "welcome to our socail app!": process.env.BASE_URL });
});
console.log("process.env.BASE_URL ", process.env.BASE_URL);

router.use(BASE_URL + "users", userRoutes);

module.exports = router;
