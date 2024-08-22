const express = require("express");
const router = express.Router();
const { authenticate, adminAuth, createToken } = require("../auth");
const User = require("../models/User");

router.get("/register", (req, res) => {
  console.log("route called");
  res.render("register_form", { errors: [] });
});

router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;
  // console.log(`Email: ${email}, Password: ${password}`)

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log(`Attempt to register with an existing email: ${email}`);
    return res.render("register_form", {
      errors: ["Email already in use. Please choose another email."],
    });
  }

  try {
    const newUser = await User.create({ userName, email, password });
    console.log(`user ${newUser.userName} created`);
    const token = await createToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.render("/profile", { newUser });
  } catch (err) {
    res.render("register_form", { errors: err.message });
  }
});

router.get("/login", (req, res) => {
  res.render("login_form", { errors: [] });
});

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.render("login_form", {
        errors: ["no user with that email found"],
      });
    }
    const validPass = await user.validatePass(req.body.password);
    if (!validPass) {
      return res.render("login_form", { errors: ["invalid password"] });
    }
    const token = await createToken(user._id);
    res.cookie("token", token, { httpOnly: true });
    res.render("profile", { user });
  } catch (err) {
    res.render("login_form", {
      errors: [err.message || "An error creating token occured call jacob"],
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });
  res.redirect("/");
});

module.exports = router;
