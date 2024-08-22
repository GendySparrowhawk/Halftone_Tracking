const { sign, verify } = require("jsonwebtoken");
const User = require("../models/User");

async function createToken(user_id) {
  try {
    const token = await sign({ user_id }, process.env.JWT_SECRET);

    return token;
  } catch (err) {
    console.log("jwt failed to create", err.message);
  }
}

async function authenticate({ req, res }) {
  const token = req.cookies.token;

  if (!token) return { user: null, res };

  try {
    const data = await verify(token, process.env.JWT_SECRET);

    const user = await User.findById(data.user_id).populate("customers");
    return { user, res };
  } catch (err) {
    console.log("failed to find user data", err.message);
    return { user: null, res };
  }
}

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "No token found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECTRET);
    if (decoded.role === "admin") {
      next();
    } else {
      res
        .status(403)
        .json({ message: "You must be an admin to use this feature" });
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid admin token" });
  }
};

module.exports = { createToken, authenticate, adminAuth };
