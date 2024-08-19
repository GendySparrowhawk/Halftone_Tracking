const { model, Schema } = require("mongoose");
const Writer = require("./writer");
const Artist = require("./Artist");
const Series = require('./Series');

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
