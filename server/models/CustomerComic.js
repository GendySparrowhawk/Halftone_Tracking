const { model, Schema } = require("mongoose");

const customerComicSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  comic: {
    type: Schema.Types.ObjectId,
    ref: "Comic",
    required: true,
  },
  series: {
    type: Schema.Types.ObjectId,
    ref: "Series",
  },
  status: {
    type: String,
    enum: ["pulled", "ordered", "arrived", "picked up", "delayed"],
    default: "pulled",
  },
  quantity: {
    type: Number,
    default: 1,
  },
  pullDate: {
    type: Date,
    default: Date.now,
  },
});

const CustomerComic = model("CustomerComic", customerComicSchema);
module.exports = CustomerComic;
