const express = require("express");
const router = express.Router();
const Comic = require("../models/Comic");
const upload = require("../gridfs/uploadRoutes");
const { authenticate } = require("../auth");
const User = require("../models/User");

// view comics page for a user
router.get("/", authenticate, async (req, res) => {
  try {
    console.log('tried comic route')
    const user = await User.findById(req.user._id).lean();

    if (!user) {
      return res.redirect("/auth/login", {
        errors: ["You must be logged in to view this"],
      });
    }
  
    const comics = await Comic.find().lean();
    res.render("comics", {
      user: user,
      comics: comics,
    });
  } catch (err) {
    console.error("Error getting comics", err.message);
    res.redirect("/profile");
  }
});

// create a comic
// router.post("/upload", upload.single("coverImage"), async (req, res) => {
//   const { title, issue, releaseDate, series } = req.body;

//   const newComic = new Comic({
//     title,
//     issue,
//     releaseDate,
//     series,
//     coverImage: req.file.id,
//   });
// });

module.exports = router;
