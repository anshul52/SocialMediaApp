const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/user.controller");

router.get("/getuser/:userId", getUser);

module.exports = router;
