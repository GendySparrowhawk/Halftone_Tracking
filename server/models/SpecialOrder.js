const { model, Schema } = require("mongoose");

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    distributor: {
        type: String,
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    eta: {
        type: Date,
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer"
    }
});

const SpecialOrder = model("SpecialOrder", itemSchema);
module.exports = SpecialOrder;