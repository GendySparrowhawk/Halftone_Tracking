const mongoose = require("mongoose");
const { S3Client } = require("@aws-sdk/client-s3");
require("dotenv").config();

const is_prod = process.env.NODE_ENV === "production";
const dbURI = is_prod
  ? process.env.MONGODB_URI
  : "mongodb://127.0.0.1:27017/Halftone";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const connectDB = async () => {
  try {
    mongoose.connect(dbURI, {
      useUnifiedTopology: true,
    });
    console.log("monogo db connected");
  } catch (err) {
    console.error("mongo db failed to connect: ", err);
    process.exit(1);
  }
};

module.exports = { connectDB, s3 };
