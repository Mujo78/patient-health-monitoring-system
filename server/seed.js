const mongoose = require("mongoose");
const User = require("./models/user");
const asyncHandler = require("express-async-handler");
const connectDB = require("./config/db");
const Pharmacy = require("./models/pharmacy");
const dotenv = require("dotenv").config();

connectDB();

const pharmacyData = {
  name: process.env.PH_NAME,
  address: process.env.PH_ADDRESS,
  description: process.env.PH_DESCRIPTION,
  phone_number: process.env.PH_PHONE_NUMBER,
  from: process.env.PH_FROM,
  to: process.env.PH_TO,
  email: process.env.PH_EMAIL,
  password: process.env.PH_PASSWORD,
};

const seedDb = asyncHandler(async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const image = "pharmacy.png";
    const existingOne = await Pharmacy.find();

    if (existingOne.length === 0) {
      const newPharmacyUser = await User.create(
        [
          {
            email: pharmacyData.email,
            role: "PHARMACY",
            photo: image,
            password: pharmacyData.password,
            passwordConfirm: pharmacyData.password,
          },
        ],
        { session }
      );

      const newPharmacy = await Pharmacy.create(
        [
          {
            user_id: newPharmacyUser[0]._id,
            name: pharmacyData.name,
            address: pharmacyData.address,
            from: pharmacyData.from,
            to: pharmacyData.to,
            description: pharmacyData.description,
            phone_number: pharmacyData.phone_number,
          },
        ],
        { session }
      );

      console.log(`Pharmacy: ${newPharmacy[0].name} successfully created!`);

      await session.commitTransaction();
      session.endSession();
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.log(err.message);
    throw new Error(err);
  }
});

seedDb().then(() => {
  mongoose.disconnect();
});
