const { model, Schema } = require("mongoose");

const artistSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const Artist = model("Artists", artistSchema);
module.exports = Artist;
