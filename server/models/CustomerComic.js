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
  variant: {
    type: Schema.Types.ObjectId
  },
  status: {
    type: String,
    enum: ["pulled", "ordered", "arrived", "picked up", "delayed"],
    default: "pulled",
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: ["pulled", "ordered", "arrived", "picked up", "delayed"],
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  quantity: {
    type: Number,
    default: 1,
  },
});

const CustomerComic = model("CustomerComic", customerComicSchema);
module.exports = CustomerComic;
