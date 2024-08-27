const express = require("express");
const router = express.Router();
const multer = require("multer");
const { gfs } = require("./gridfsSetup"); // Assuming you saved the previous setup as gridfsSetup.js
const Comic = require("./models/Comic");
const path = require("path");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  userNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('coverImage'), async (req, res) => {
    const { title, issue, releaseDate, series } =req.body;

    const newComic = new Comic({
      title,
      issue,
      releaseDate,
      series,
      coverImage: req.file.id,
    });

    // try {
    //   await newComic.save();
    // }
})
