const { model, Schema } = require("mongoose");

const seriesSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  comics: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comic",
    },
  ],
});

const Series = model("Series", seriesSchema);
module.exports = Series;
