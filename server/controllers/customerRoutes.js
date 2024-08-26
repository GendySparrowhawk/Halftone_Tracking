const express = require("express");
const router = express.Router();
const { authenticate } = require("../auth");
const User = require("../models/User");
const Customer = require("../models/Customer");
const CustomerComic = require("../models/CustomerComic");

router.get("/", authenticate, async (req, res) => {
  try {
    const customers = req.user.customers.map(customer => customer.toObject());
    res.render("customers", { 
      user: req.user,
      customers,
      errors: [] });
  } catch (err) {
    console.error("error fetching customers: ", err.message);
  }
});

router.post("/", authenticate, async (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  try {
    const newCustomer = new Customer({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    console.log(
      `new cusotmer ${newCustomer.firstName} ${newCustomer.lastName} added`
    );

    await newCustomer.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { customers: newCustomer._id },
    });

    console.log(`cust added to ${req.user.userName}`);

    res.redirect("/cust");
  } catch (err) {
    console.error("Error adding customers: ", err.message);
    res.render("customers", {
      user: req.user,
      customers: req.user.customers,
      errors: [err.message],
    });
  }
});

module.exports = router;
