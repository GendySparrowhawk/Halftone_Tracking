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

router.post("/quick-add", authenticate, async (req, res) => {
  console.log("quick add to cust attempted");
  const { comicId, customerId } = req.body;

  try {
    const comic = await Comic.findById(comicId);
    const customer = await Customer.findById(customerId);

    if (!comic || !customer) {
      return res.status(404).send("NO comic or customer detected");
    }

    const customerComic = new CustomerComic({
      customer: customerId,
      comic: comicId,
      series: comic.series,
      status: "pulled",
      pullDate: new Date(),
    });
    await customerComic.save();
  } catch (err) {
    console.error("Error adding to cust", err);
    res.status(500).send("server error contact jacob /quick add route");
  }
});

module.exports = router;
