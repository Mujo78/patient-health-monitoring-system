const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const connectDB = require("./config/db");
const seedDepartment = require("./seeds/department.seed");
const logger = require("./utils/logger");
const seedPharmacy = require("./seeds/pharmacy.seed");
const seedMedicine = require("./seeds/medicine.seed");
const seedDoctor = require("./seeds/doctor.seed");

const seedDb = asyncHandler(async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const departmentId = await seedDepartment(session);
    await seedDoctor(session, departmentId);
    const pharmacyId = await seedPharmacy(session);
    await seedMedicine(session, pharmacyId);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    logger.error(error);
    throw new Error(error);
  }
});

connectDB().then(() => {
  seedDb().then(() => {
    mongoose.disconnect();
  });
});
