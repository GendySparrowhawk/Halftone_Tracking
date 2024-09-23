const express = require("express");
const router = express.Router();
const { authenticate } = require("../auth");
const User = require("../models/User");
const Customer = require("../models/Customer");
const CustomerComic = require("../models/CustomerComic");
const { start } = require("repl");
// get customers page
router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const customers = await Customer.find()
      .populate('comics').lean()

    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
 
    res.render("customers", {
      user: user,
      customers: customers
    });
  } catch (err) {
    console.error("error fetching customers", err.message);
    res.status(500).render("error", { message: "Error loading customers" });
  }
});

// get a customer specific page
router.get("/:customerId", authenticate, async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const customer = await Customer.findById(customerId).populate({
      path: "comics",
      model: "CustomerComic",
      populate: {
        path: "comic",
        model: "Comic",
      },
    }).lean();

    if (!customer) {
      console.log('error getting id')
      return res.status(404).render("customers", { message: "customer not found" });
    }

    res.render("customer-detail", {
      user: req.user,
      customer: customer,
    });
  } catch (err) {
    console.error("erro fetching details: ", err.message);
    res.status(500).render("error", {
      message: "tell jacob line 42 cust routes, he'll know what it means",
    });
  }
});

// add a customer
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
    res.render("customers", {
      user: req.user,
      customers: req.user.customers,
      errors: [err.message],
    });
  } catch (err) {
    console.error("Error adding customers: ", err.message);
    res.render("customers", {
      user: req.user,
      customers: req.user.customers,
      errors: [err.message],
    });
  }
});

// quick add customer
router.post("/quick", authenticate, async (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  try {
    const user = await User.findById(req.user._id).populate("customers");
    const existingCustomer = user.customers.find(
      (customer) =>
        customer.firstName === firstName && customer.lastName === lastName
    );
    if (existingCustomer) {
      return res.json({ message: "This customer already exists" });
    }
    const newCustomer = await Customer({
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    await newCustomer.save();
    user.customers.push(newCustomer._id);
    await User.updateOne(
      { _id: req.user._id },
      { $push: { customers: newCustomer._id } }
    );
    console.log(
      `new cusotmer ${newCustomer.firstName} ${newCustomer.lastName} added`
    );
    return res.redirect(`/cust/${newCustomer._id}`)
  } catch (err) {
    console.error("Error adding cust: ", err.message);
    return res
      .status(500)
      .json({ message: "Server error tell jacob at line 110" });
  }
});

module.exports = router;
