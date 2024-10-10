const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const { getUser } = require("../controllers/user.controller");

router.get("/getuser", checkAuth, getUser);

module.exports = router;
