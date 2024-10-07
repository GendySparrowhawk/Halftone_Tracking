const express = require("express");
const router = express.Router();
const upload = require("../gridfs/uploadRoutes");
const { authenticate } = require("../auth");
const Comic = require("../models/Comic");
const User = require("../models/User");
const Series = require("../models/Series");
const Artist = require("../models/Artist");
const Author = require("../models/Author");
const Publisher = require("../models/Publisher");
const gfs = require("../config/connection");
const Customer = require("../models/Customer");
const CustomerComic = require("../models/CustomerComic");
const { release } = require("os");

// view comics page for a user
router.get("/", authenticate, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;

  try {
    console.log("tried comic route");
    // console.log("Authenticated user:", req.user);
    // console.log("User ID:", req.user._id);
    const user = await User.findById(req.user._id).lean();

    if (!user) {
      return res.redirect("/auth/login", {
        errors: ["You must be logged in to view this"],
      });
    }
    const totalComics = await Comic.countDocuments();

    const comics = await Comic.find()
      .populate("series")
      .skip(skip)
      .limit(limit)
      .lean();
    const customers = await Customer.find({ user: req.user._id }).lean();
    console.log("customers: ", customers);
    const totalPages = Math.ceil(totalComics / limit);
    // console.log("comics data:")
    res.render("comics", {
      user: user,
      comics: comics,
      customers: customers,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error("Error getting comics", err.message);
    res.redirect("/profile");
  }
});

// get a single comics page
router.get("/:comicId", authenticate, async (req, res) => {
  console.log("single route attempted");
  try {
    const userId = req.user._id;
    const comicId = req.params.comicId;

    const comic = await Comic.findById(comicId)
      .populate("series")
      .populate("authors")
      .populate("artists")
      .populate("publisher")
      .lean();

    if (!comic) {
      return res.status(404).render("404", { message: "comic not found" });
    }

    const authorsList = await Author.find().lean();
    const artistList = await Artist.find().lean();
    const seriesList = await Series.find().lean();
    const customerComics = await CustomerComic.find({ comic: comicId })
      .populate("customer")
      .lean();
    const customers = customerComics.map((cc) => cc.customer);

    return res.render("comic_detail", {
      comic,
      customers,
      user: req.user,
      seriesList,
      authorsList,
      artistList,
    });
  } catch (err) {
    console.error("error fetching comic", err.message);
    return res.status(404).render("profile", { message: "comic not found" });
  }
});

// create a comic with all the juicy details
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const {
      title,
      issue,
      releaseDate,
      seriesTitle,
      seriesId,
      authors,
      artists,
    } = req.body;

    let series;
    if (seriesId) {
      series = await Series.findById(seriesId);
    }
    if (!series) {
      return res.status(400).json({ message: "series not found" });
    } else if (seriesTitle) {
      series = new Series({ title: seriesTitle });
      await series.save();
    } else {
      return res.status(400).json({ message: "you must provide a series" });
    }

    const authorIds = await Promise.all(
      authors.map(async (author) => {
        let foundAuthor = await Author.findOne({ aName });
        if (!foundAuthor) {
          foundAuthor = new Author({ aName });
          await foundAuthor.save();
        }
        return foundAuthor._id;
      })
    );

    const artistIds = await Promise.all(
      artists.map(async (artist) => {
        let foundArtist = await Artist.findOne({ aName });
        if (!foundArtist) {
          foundArtist = new Artist({ aName });
          await foundArtist.save();
        }
        return foundArtist._id;
      })
    );

    const newComic = new Comic({
      title,
      issue,
      releaseDate,
      series: series._id,
      variants: [
        {
          name: "A cover",
          isIncentive: false,
          coverImage: req.file ? req.file.id : null,
        },
      ],
      authors: authorIds,
      artists: artistIds,
    });
    await newComic.save();
    series.comics.push(newComic._id);
    await series.save();
    console.log(`new comic ${title} added to series ${series.title}`);
    return res.redirect(`/comics/${newComic._id}`);
  } catch (err) {
    consol.error("Error adding comi: ", err.message);
    return res
      .status(500)
      .json({ message: "Server error adding comics recheck routes" });
  }
});

// quick add a comic with less info but easier for in store turn around
router.post("/quick", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, issue, releaseDate, seriesTitle, seriesId } = req.body;
    let series;
    if (seriesId) {
      series = await Series.findById(seriesId);
    }
    if (!series && seriesTitle) {
      series = new Series({ title: seriesTitle });
      await series.save();
    }

    if (!series && !seriesTitle) {
      return res.status(400).json({
        message: "You must attach this comic to a series, even a one shot",
      });
    }
    const existingComic = await Comic.findOne({
      title,
      issue,
      series: series._id,
    });

    if (existingComic) {
      return res.render(req.headers.referer, {
        user: req.user,
        errors: [`Comic ${existingComic.title} already exists`],
      });
    }

    const newComic = new Comic({
      title,
      issue,
      releaseDate,
      series: series._id,
      variants: [
        {
          name: "A cover",
          isIncentive: false,
          coverImage: req.file ? req.file.location : null,
        },
      ],
    });
    await newComic.save();
    series.comics.push(newComic._id);
    await series.save();
    console.log(`New comic ${title} added to series ${series.title}`);
    return res.redirect(`/comics/${newComic._id}`);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error adding comic tell jacob to check route" });
  }
});

// add a variant
router.post(
  "/:id/variant",
  authenticate,
  upload.single("coverImage"),
  async (req, res) => {
    console.log("add variant route tried");
    try {
      const comicId = req.params.id;
      const { name, isIncentive } = req.body;
      const coverImage = req.file ? req.file.filename : null;
      const comic = await Comic.findById(comicId);

      if (!comic) {
        return res.redirect(
          `${req.headers.referer}?message=No+coimc+detected&messageType=error`
        );
      }
      const newVariant = {
        name,
        isIncentive: isIncentive === "true",
        coverImage,
      };
      comic.variants.push(newVariant);
      await comic.save();
      console.log("Variant added successfully");
      return res.redirect(
        `${req.headers.referer}?message=variant+added!&messageType=success`
      );
    } catch (err) {
      console.error("Error adding to cust", err);
      return res.redirect(
        `${req.headers.referer}?message=Error+occurred+tell+Jacob+to+check+route&messageType=error`
      );
    }
  }
);

// edit a comic
router.post("/:id/edit", upload.none(), authenticate, async (req, res) => {
  console.log("edit comic attepmted");
  try {
    const comicId = req.params.id;
    const {
      title,
      issue,
      releaseDate,
      foc,
      description,
      series,
      newSeries,
      authors = [],
      newAuthors = [],
      artists = [],
      newArtists = [],
    } = req.body;

    console.log(req.body);

    const comic = await Comic.findById(comicId);

    if (!comic) {
      return res.redirect(
        `${req.headers.referer}?message=No+coimc+detected&messageType=error`
      );
    }
    const updates = {};

    if (title) updates.title = title;
    if (issue) updates.issue = issue;
    if (releaseDate) updates.releaseDate = new Date(releaseDate);
    if (foc) updates.FOC = new Date(foc);
    if (description) updates.description = description;

    if (newSeries && newSeries.trim() !== "") {
      const newSeriesDoc = await Series.create({ title: newSeries });
      updates.series = newSeriesDoc._id;
    } else if (series) {
      updates.series = series;
    }

    const authorIds = [];
    if (newAuthors && Array.isArray(newAuthors)) {
      for (const authorName of newAuthors) {
        if (authorName.trim() !== "") {
          const newAuthor = await Author.create({ aName: authorName });
          authorIds.push(newAuthor._id);
          console.log("new author added");
        }
      }
    }

    const artistIds = [];
    if (newArtists && Array.isArray(newArtists)) {
      for (const artistName of newArtists) {
        if (artistName.trim() !== "") {
          const newArtist = await Artist.create({ aName: artistName });
          artistIds.push(newArtist._id);
          console.log("new artist added");
        }
      }
    }

    updates.artists = artistIds;
    const updatedComic = await Comic.findByIdAndUpdate(
      comicId,
      { $set: updates },
      { new: true }
    );

    if (!updatedComic) {
      return res.redirect(
        `${req.headers.referer}?message=no+updated+comic+found+tell+jacob&messageType=error`
      );
    }

    return res.redirect(
      `${req.headers.referer}?message=Comic+updated&messageType=success`
    );
  } catch (err) {
    console.error("Error updating comic:", err);
    return res.redirect(
      `${req.headers.referer}?message=error+updating+comic+tell+jacob&messageType=error`
    );
  }
});

// add the next in series
  router.post(
    "/:id/next",
    upload.single("coverImage"),
    authenticate,
    async (req, res) => {
      console.log("add next in series tried");
      try {
        const comicId = req.params.id;
        const { releaseDate, FOC } = req.body;
        const coverImage = req.file ? req.file.location : null;
        console.log(req.file)

        const comic = await Comic.findById(comicId);

        if (!comic) {
          return res.redirect(
            `${req.headers.referer}?message=No+comic+found&messageType=error`
          );
        }
        const newComic = new Comic({
          title: comic.title,
          issue: comic.issue + 1,
          releaseDate: releaseDate || null,
          FOC: FOC || comic.FOC,
          series: comic.series,
          publisher: comic.publisher,
          authors: comic.authors,
          artists: comic.artists,
          description: comic.description,
          variants: [],
        });
        if (coverImage) {
          console.log("pushing new img to variant")
          newComic.variants.push({
            name: "A Cover",
            isIncentive: false,
            coverImage,
            artist: comic.artists[0],
          });
        }
        await newComic.save();
        console.log("next issue added");
        return res.redirect(`/comics/${newComic._id}`)
      } catch (err) {
        console.error("error adding next:", err);
        return res.redirect(
          `${req.headers.referer}?message=error+adding+comic+tell+jacob+line+362&messageType=error`
        );
      }
    }
  );
module.exports = router;
