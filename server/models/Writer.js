const { model, Schema } = require("mongoose");

const writerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const Writer = model("Writer", writerSchema);
module.exports = Writer;
