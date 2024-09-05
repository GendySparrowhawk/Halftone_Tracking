const { model, Schema } = require("mongoose");
const Writer = require("./writer");
const Artist = require("./Artist");
const Series = require("./Series");
const { deflate } = require("zlib");
const variantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isIncentive: {
    type: Boolean,
    deflult: false
  },
  coverImage: {
    type: Schema.Types.ObjectId,
    ref: "fs.files",
  },
});

const comicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  issue: {
    type: Number,
    required: true,
  },
  releaseDate: {
    type: Date,
  },
  series: [
    {
      type: Schema.Types.ObjectId,
      ref: "Series",
    },
  ],
  variants: [variantSchema],
  auhtors: [
    {
      type: Schema.Types.ObjectId,
      ref: "Author",
    },
  ],
  artists: [
    {
      type: Schema.Types.ObjectId,
      ref: "Artist",
    },
  ],
});

const Comic = model("Comic", comicSchema);
module.exports = Comic;
