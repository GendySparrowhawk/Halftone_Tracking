const { model, Schema } = require("mongoose");

const artistSchema = new Schema({
  aName: {
    type: String,
    required: true,
  },
});

const Artist = model("Artist", artistSchema);
module.exports = Artist;
