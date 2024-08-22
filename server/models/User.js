const { Schema, model } = require("mongoose");
const { hash, compare } = require("bcrypt");

const Customer = require("./Customer");

const userSchema = new Schema(
  {
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
    toJson: {
      transform(_, user) {
        delete user._v;
        delete user.password;
        return user;
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
