const { Schema, model } = require("mongoose");
const { hash, compare } = require("bcrypt");

const Customer = require("./Customer");

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minLength: [3, "your username must be at least 3 characers long"],
      maxLength: [10, "your username must be shorter than 10 charcaters"],
      unique: true
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator(val) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(val);
        },
        message() {
          return "You must use a valid email address";
        },
      },
    },
    password: {
      type: String,
      unique: true,
      minLength: [6, "password must be between 6 and 15 characters long"],
      maxLength: [15, "password must be between 6 and 15 characters long"],
    },
    customers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],
  },
  {
    timestamps: true,
    methods: {
      async validatePass(formPassword) {
        const is_vaild = await compare(formPassword, this.password);

        return is_vaild;
      },
    },
    toJSON: {
      transform(doc, ret) {
        delete ret._v;
        delete ret.password;
        return ret;  
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.password = await hash(this.password, 10);
  }

  next();
});

const User = model("User", userSchema);
module.exports = User;
