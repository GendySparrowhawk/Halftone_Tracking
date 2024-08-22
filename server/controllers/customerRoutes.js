const express = require("express");
const router = express.Router();
const { authenticate } = require("../auth");
const User = require("../models/User");
const Customer = require("../models/Customer");
const CustomerComic = require("../models/CustomerComic");

router.get("/", authenticate, async (req, res) => {
    try {
      const customers = req.user.customers;
      res.render("customers", { customers, errors: [] });
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
      req.user.customers.push(newCustomer);
      await req.user.save();
      res.redirect("/customers");
    } catch (err) {
      console.error("Error adding customers: ", err.message);
      res.render("customers", {
        customers: req.user.customers,
        errors: [err.message],
      });
    }
  });
  
  module.exports = router;