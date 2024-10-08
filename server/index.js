const express = require("express");
const app = express();
const routes = require("./routes/index");
require("dotenv").config();
const connectionDB = require("./config/db");
const { PORT } = require("./config/config");

const logger = require("morgan");

app.use(logger("dev"));
app.use(express.json());
app.use(routes);

app.listen(3000, () => {
  console.log(`server is running on the port ${PORT}`);
});
