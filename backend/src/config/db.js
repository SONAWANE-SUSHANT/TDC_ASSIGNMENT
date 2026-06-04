const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const connection = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
