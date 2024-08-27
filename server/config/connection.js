const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

const is_prod = process.env.NODE_ENV === "production";
const dbURI = is_prod
  ? process.env.DB_URL
  : "mongodb://127.0.0.1:27017/Halftone";

let gfs;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      // useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
    const conn = mongoose.connection;
    conn.once("open", () => {
      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection("uploads");
      console.log("grid fs connected");
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

module.exports = { connectDB, gfs };
