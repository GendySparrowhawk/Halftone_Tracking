const { model, Schema } = require("mongoose");
const Writer = require("./writer");
const Artist = require("./Artist");
const Series = require("./Series");
const variantSchema = new Schema({
  variantName: {
    type: String,
    required: true,
  },
  coverImage: {
    type: Schema.Types.ObjectId,
    ref: "CoverImage",
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
  cover: {
    type: String,
    default: "A",
  },
  coverImage: {
    type: Schema.Types.ObjectId,
    ref: "fs.files",
  },
  isIncentive: {
    type: Boolean,
    default: false,
  },
  writers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Writer",
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
