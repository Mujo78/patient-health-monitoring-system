const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const db = process.env.DB.replace("<password>", process.env.PASS);
    const conn = await mongoose.connect(db);
    console.log(`Connected to mongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
