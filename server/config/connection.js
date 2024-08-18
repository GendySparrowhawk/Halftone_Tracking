const mongoose = require('mongoose');

const is_prod = process.env.NODE_ENV === 'production';
const dbURI = is_prod ? process.env.DB_URL : 'mongodb://127.0.0.1:27017/Halftone';

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

module.exports = connectDB;