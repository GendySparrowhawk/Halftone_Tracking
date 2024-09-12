const { model, Schema } = require("mongoose");
const Author = require("./Author");
const Artist = require("./Artist");
const Series = require("./Series");

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
    type: String
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
  authors: [
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
