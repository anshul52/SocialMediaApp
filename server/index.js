const express = require("express");
const app = express();
const routes = require("./routes/index");
const cors = require("cors");
require("dotenv").config();
const connectionDB = require("./config/db");
const { PORT } = require("./config/config");
const logger = require("morgan");
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`server is running on the port ${PORT}`);
});
