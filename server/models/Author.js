const { model, Schema } = require("mongoose");

const authorSchema = new Schema({
  aName: {
    type: String,
    required: true,
  },
});

const Author = model("Author", authorSchema);
module.exports = Author;
