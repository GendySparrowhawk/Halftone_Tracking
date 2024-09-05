const express = require("express");
const router = express.Router();
const upload = require("../gridfs/uploadRoutes");
const { authenticate } = require("../auth");
const Comic = require("../models/Comic");
const User = require("../models/User");
const Series = require("../models/Series");
const Artist = require("../models/Artist");
const Author = require("../models/Author");

// view comics page for a user
router.get("/", authenticate, async (req, res) => {
  try {
    console.log("tried comic route");
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

// get a single comics page
router.get("/:comicId", authenticate, async (req, res) => {
  try {
    const comicId = req.params.comicId;

    const comic = await Comic.findById(comic)
      .populate({
        path: "comics",
      })
      .lean();

    res.render("comic-detail", {
      user: req.user,
      comic: comic,
    });
  } catch (err) {
    console.error("error fetching comic", err.message);
    return res.status(404).render("comics", { message: "comic not found" });
  }
});

// create a comic
router.post("/quick", upload.single("coverImage"), async (req, res) => {
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
        const [firstName, lastName] = author.split(" ");
        let foundAuthor = await Author.findOne({ firstName, lastName });
        if (!foundAuthor) {
          foundAuthor = new Author({ firstName, lastName });
          await foundAuthor.save();
        }
        return foundAuthor._id;
      })
    );

    const artistIds = await Promise.all(
      artists.map(async (artist) => {
        const [firstName, lastName] = artist.split(" ");
        let foundArtist = await Artist.findOne({ firstName, lastName });
        if (!foundArtist) {
          foundArtist = new Artist({ firstName, lastName });
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
    return res.redirect(`comic/${newComic._id}`);
  } catch (err) {
    consol.error("Error adding comi: ", err.message);
    return res
      .status(500)
      .json({ message: "Server error adding comics recheck routes" });
  }
});

module.exports = router;
