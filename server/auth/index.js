const { sign, verify } = require("jsonwebtoken");
const User = require("../models/User");


async function createToken(user) {
  try {
    const token = sign({ user_id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    console.log(token);
    return token;
  } catch (err) {
    console.log("jwt failed to create", err.message);
  }
}

async function authenticate(req, res, next) {
  try {
    // console.log("auth?: ", req);
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "no token found" });
    }
    const decoded = verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user_id).populate("customers");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // console.log(`authenticated user: ${user}`);
    req.user = user;
    next();
  } catch (err) {
    console.log("Failed to get user data", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function createAdminToken(user) {
  try {
    const token = sign({ user_id: user._id }, process.env.ADMIN_TOKEN_SECTRET, {
      expiresIn: "8h",
    });
    console.log(token);
    return token;
  } catch (err) {
    console.log("Failed to create admin token");
    return res.status(401).json({ message: "token creation failed" });
  }
}

async function adminAuth(req, res, next) {
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
}

module.exports = { createToken, authenticate, adminAuth, createAdminToken };
