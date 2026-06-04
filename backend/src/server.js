const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });
};

startServer();
