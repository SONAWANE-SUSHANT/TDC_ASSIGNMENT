const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ai_matchmaker_dashboard",
  clientUrl: process.env.CLIENT_URL || "https://tdc-assignment-32ud.vercel.app",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  dummyAuthEmail: process.env.DUMMY_AUTH_EMAIL || "admin@matchmaker.ai",
  dummyAuthPassword: process.env.DUMMY_AUTH_PASSWORD || "admin123"
};

module.exports = env;
