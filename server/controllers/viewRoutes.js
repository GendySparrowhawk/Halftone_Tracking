const express = require("express");
const router = express.Router();
const { authenticate } = require("../auth");
const User = require("../models/User");
const Customer = require("../models/Customer");
const CustomerComic = require("../models/CustomerComic");

// profile routes
router.get("/profile", authenticate, async (req, res) => {
  try {
    console.log("route attempted /profile");
    const user = req.user;
    if (!user) {
      return res.redirect("/auth/login", {
        errors: ["you must be logged in to view these details"],
      });
    }

    const populatedUser = await User.findById(user._id).populate({
      path: "customers",
      populate: {
        path: "comics",
        model: "CustomerComic",
        populate: {
          path: "comic",
          model: "Comic",
        },
      },
    }).lean();

    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const thisWeekComics = populatedUser.customers
      .map((customer) => ({
        customerName: `${customer.firstName} ${customer.lastName}`,
        comics: customer.comics
          .filter((cc) => {
            const releaseDate = new Date(cc.comic.releaseDate);
            return releaseDate >= startOfWeek && releaseDate <= endOfWeek;
          })
          .map((cc) => ({
            title: cc.comic.title,
            releaseDate: cc.comic.releaseDate,
            status: cc.status,
            quantity: cc.quantity,
          })),
      }))
      .filter((entry) => entry.comics.length > 0);

    res.render("profile", {
      user: populatedUser,
      customers: populatedUser.customers,
      thisWeekComics,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.redirect("/login");
  }
});

module.exports = router;