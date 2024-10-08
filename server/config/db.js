const mysql = require("mysql");
const connectionDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "socialappdb",
});

connectionDB.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = connectionDB;
