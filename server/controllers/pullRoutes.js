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

// main add to customer route
router.post("/", authenticate, async (req, res) => {
  console.log("pull route attemped")
  const { comicId, customerId, variantId } = req.body;
  try {
    const comic = await Comic.findById(comicId);
    const customer = await Customer.findById(customerId);

    if (!comic) {
      return res.redirect(`${req.headers.referer}?message=No+comic+detected&messageType=error`);
    }
    if(!customer) {
      return res.redirect(`${req.headers.referer}?message=No+customer+detected&messageType=error`);

    }

    const existingCustomerComic = await CustomerComic.findOne({
      customer: customerId,
      comic: comicId,
      "variant._id": variantId
    });

    if(existingCustomerComic) {
      return res.redirect(`${req.headers.referer}?message=This+customer+already+pulled+this+comic&messageType=error`)
    }

    const customerComic = new CustomerComic({
      customer: customerId,
      comic: comicId,
      series: comic.series,
      variant: variantId,
      status: "pulled",
      pullDate: new Date(),
    });

    await customerComic.save();
    customer.comics.push(customerComic._id);
    await customer.save();
    return res.redirect(`${req.headers.referer}?message=Comic+added+to+pull+list&messageType=success`);

  } catch (err) {
    console.error("Error adding to cust", err);
    return res.redirect(`${req.headers.referer}?message=Error+occurred+tell+Jacob+to+check+route&messageType=error`);
  }
})

router.post("/quick-add", authenticate, async (req, res) => {
  console.log("quick add to cust attempted");
  const { comicId, customerId, variantId } = req.body;

  try {
    const comic = await Comic.findById(comicId);
    const customer = await Customer.findById(customerId);

    if (!comic) {
      return res.redirect(`${req.headers.referer}?message=No+comic+detected&messageType=error`);
    }
    if(!customer) {
      return res.redirect(`${req.headers.referer}?message=No+customer+detected&messageType=error`);

    }

    const existingCustomerComic = await CustomerComic.findOne({
      customer: customerId,
      comic: comicId,
      "variant._id": variantId
    });

    if(existingCustomerComic) {
      return res.redirect(`${req.headers.referer}?message=This+customer+already+pulled+this+comic&messageType=error`)
    }

    const customerComic = new CustomerComic({
      customer: customerId,
      comic: comicId,
      series: comic.series,
      variant: variantId,
      status: "pulled",
      pullDate: new Date(),
    });

    await customerComic.save();
    customer.comics.push(customerComic._id);
    await customer.save();
    return res.redirect(`${req.headers.referer}?message=Comic+added+to+pull+list&messageType=success`);

  } catch (err) {
    console.error("Error adding to cust", err);
    return res.redirect(`${req.headers.referer}?message=Error+occurred+tell+Jacob+to+check+route&messageType=error`);
  }
});

// remove a pull from comic page
router.post('/remove', authenticate, async (req, res) => {
  console.log("remove pull route tried")
  try {
    const { customerId, comicId } = req.body;
    if (!customerId) {
      return res.redirect(`${req.headers.referer}?message=No+customer+found+possible+leak+tell+Jacob&messageType=error`);
    }
    if (!comicId) {
      return res.redirect(`${req.headers.referer}?message=No+comic+found+possible+leak+tell+Jacob&messageType=error`);
    }

    const customerComic = await CustomerComic.findOneAndDelete({
      customer: customerId,
      comic: comicId,
    })
   
    if (!customerComic) {
      return res.redirect(`${req.headers.referer}?message=No+pull+found+possible+leak+tell+Jacob&messageType=error`);
    }

    return res.redirect(`${req.headers.referer}?message=Pull+removed&messageType=success`)
  }catch (err) {
    console.error("Error removing pull", err);
    return res.redirect(`${req.headers.referer}?message=Error+occurred+tell+Jacob+to+check+route&messageType=error`);
  }
})
module.exports = router;
