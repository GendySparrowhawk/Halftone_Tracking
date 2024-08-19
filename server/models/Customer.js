const { Schema, model } = require("mongoose");
const Comic = require('./Comic');

const customerSchema = new Schema ({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator(val) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(val)
            },
            message() {
                return 'You must enter a valid email adress'
            }
        }
    },
    phoneNumber: {
        type: String,
        validate: {
            validator(val) {
                return /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/g.test(val)
            },
            message() {
                return 'Phone number is incomplete'
            }
        }
    },
    notes: {
        type: String
    },
});

const Customer = model("Customer", customerSchema);
module.exports = Customer;