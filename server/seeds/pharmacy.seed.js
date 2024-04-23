const Pharmacy = require("../models/pharmacy");
const User = require("../models/user");
const logger = require("../utils/logger");

const pharmacyProfileData = {
  email: "pharmacy_hospital@hs.com",
  role: "PHARMACY",
  photo: "pharmacy.jpeg",
  password: "123456789",
  passwordConfirm: "123456789",
  first: true,
  isVerified: true,
  active: true,
};

const pharmacyData = {
  name: "Pharmacy_Hospital",
  address: "address b.b",
  description: "Pharmacy description",
  phone_number: "111333222444",
  from: 9,
  to: 4,
};

const seedPharmacy = async (session) => {
  try {
    const existingPharmacy = await Pharmacy.findOne();

    if (!existingPharmacy) {
      const newPharmacyUser = await User.create(
        [
          {
            ...pharmacyProfileData,
          },
        ],
        {
          session,
        }
      );

      const newPharmacy = await Pharmacy.create(
        [
          {
            user_id: newPharmacyUser[0]._id,
            ...pharmacyData,
          },
        ],
        { session }
      );

      logger.info(`Pharmacy: ${newPharmacy[0].name} successfully created!`);

      return newPharmacy[0]._id;
    } else {
      logger.error(`Pharmacy: ${pharmacyData.name} already exists!`);
    }
  } catch (err) {
    logger.error(err);
    throw new Error(err);
  }
};

module.exports = seedPharmacy;
