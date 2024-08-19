const express = require("express");
const router = express.Router();
const { authenticate, adminAuth, createToken } = require("../auth");
const User = require("../models/User");

router.get("/register", (req, res) => {
  res.render("register_form", { errors: [] });
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = await User.create({ email, password });
    res.redirect("/login");
  } catch (err) {
    res.render("register_form", { errors: error.message });
  }
});

router.get("/login", (req, res) => {
  res.render("login_form", { errors: [] });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
      return res.render("login_form", { errors: ["Invalid cridentials"] });
    }
    const token = await createToken(user._id);
    res.cookie("token", token, { httpOlny: true });
    res.redirect("/");
  } catch (err) {
    res.render("login_form", {
      errors: [error.message || "An error creating token occured call jacob"],
    });
  }
});

module.exports = router;