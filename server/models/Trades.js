const { model, Schema } = require("mongoose");
const Series = require("./Series");

const tradeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  volume: {
    type: Number,
  },
  series: {
    type: Schema.Types.ObjectId,
    ref: "Series",
  },
  coverImage: {
    type: String,
  },
  releaseDate: {
    type: Date,
  },
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
  publisher: {
    type: Schema.Types.ObjectId,
    ref: "Publisher",
  },
  description: {
    type: String,
  },
  isbn: {
    type: String
  }
});

const Trade = model("Trade", tradeSchema);
module.exports = Trade;