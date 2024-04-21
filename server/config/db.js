const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    const db = process.env.DB.replace("<password>", process.env.PASS);
    const conn = await mongoose.connect(db);
    logger.info(`Connected to mongoDB: ${conn.connection.host}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
