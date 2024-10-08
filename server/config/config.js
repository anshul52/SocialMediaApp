require("dotenv").config();
exports.PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
exports.BASE_URL = process.env.BASE_URL || "/api/v11/";
console.log("process.env.BASE_URL :::", process.env.BASE_URL);

exports.DB_HOST = process.env.PORT || "localhost";
exports.DB_USER = process.env.DB_USER || "root";
exports.DB_PASSWORD = process.env.DB_PASSWORD || "";
exports.DB_NAME = process.env.DB_NAME || "chat_db";
exports.JWT_SECRET = process.env.JWT_SECRET;
