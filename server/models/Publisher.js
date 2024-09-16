const {model, Schema}= require("mongoose");

const publisherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    website: {
        type: String
    }
});

const Publisher = model("Publisher", publisherSchema);

module.exports = Publisher;

