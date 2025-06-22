const mongoose = require("mongoose");
const mongoUrl = process.env.MONGODBURI;
const connectDB = async (options = {}) => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Database is already Connected");
      return mongoose.connection;
    }
    if (!mongoUrl) {
      console.error("MongoDB URI is not defined in environment variables");
      process.exit(1);
    }
    await mongoose.connect(mongoUrl);
    console.log("Successfully connected to the mongoose Database");
    return mongoose.connection;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;
