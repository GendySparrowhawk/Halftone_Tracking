const { Schema, model } = require('mongoose');

const linkSchema = new Schema ({
    linkName: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    }
});

const Link = model("Link", linkSchema);
module.exports = Link;