const bcrypt = require("bcryptjs");
const db = require("../config/db");

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    const user = await checkUserExistsByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    const userDetails = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
    };

    return res
      .status(200)
      .json({ message: "Login successful!", user: userDetails });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({ message: "An internal error occurred.", error });
  }
};

const createUser = async (req, res) => {
  const { email, password, username, name } = req.body;

  try {
    if (!email || !password || !username || !name) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const existingUser = await checkUserExistsByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email!" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const userId = await createNewUser(email, username, hashedPassword, name);

    const userDetails = {
      id: userId,
      email,
      username,
      name,
    };

    return res
      .status(201)
      .json({ message: "User created successfully!", user: userDetails });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "An internal error occurred.", error });
  }
};

const checkUserExistsByEmail = (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [email], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result.length > 0 ? result[0] : null);
    });
  });
};

const createNewUser = (email, username, hashedPassword, name) => {
  const query = `INSERT INTO users (email, username, password, name) VALUES (?,?,?,?)`;
  return new Promise((resolve, reject) => {
    db.query(query, [email, username, hashedPassword, name], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result?.insertId);
    });
  });
};

module.exports = {
  createUser,
  loginUser,
};
