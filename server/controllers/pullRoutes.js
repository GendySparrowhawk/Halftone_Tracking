const express = require("express");
const router = express.Router();
const upload = require("../gridfs/uploadRoutes");
const { authenticate } = require("../auth");
const CustomerComic = require("../models/CustomerComic");
const Customer = require("../models/Customer");
const Comic = require("../models/Comic");
const User = require("../models/User");
const Series = require("../models/Series");
const Artist = require("../models/Artist");
const Author = require("../models/Author");
const { error } = require("console");

router.post("/quick-add", authenticate, async (req, res) => {
  console.log("quick add to cust attempted");
  const { comicId, customerId } = req.body;

  try {
    const comic = await Comic.findById(comicId);
    const customer = await Customer.findById(customerId);

    if (!comic) {
      return res.status(404).json ({ message: "No comic detected", messageType: "error"});
    }
    if(!customer) {
      return res.status(404).json ({ message: "No customer detected", messageType: "error"});

    }

    const customerComic = new CustomerComic({
      customer: customerId,
      comic: comicId,
      series: comic.series,
      status: "pulled",
      pullDate: new Date(),
    });

    await customerComic.save();
    customer.comics.push(customerComic._id);
    await customer.save();
    return res.status(200).json({ message: "Comic added to pull liset", messageType: "success"})

  } catch (err) {
    console.error("Error adding to cust", err);
    return res.status(404).json ({ message: "Tell Jacob to check quick add pull route", messageType: "error"});
  }
});

module.exports = router;
