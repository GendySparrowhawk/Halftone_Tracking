const { model, Schema } = require("mongoose");

const authorSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const Author = model("Author", authorSchema);
module.exports = Author;
