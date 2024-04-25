const Doctor = require("../models/doctor");
const User = require("../models/user");
const logger = require("../utils/logger");

const doctorProfileData = {
  email: "michael.johnson444@hs.com",
  role: "DOCTOR",
  photo: "doctor-user.jpg",
  password: "michael.johnson",
  passwordConfirm: "michael.johnson",
  first: false,
  isVerified: true,
  active: true,
};

const doctorData = {
  first_name: "Michael",
  last_name: "Johnson",
  phone_number: "111222333444",
  address: "address b.b",
  gender: "Male",
  speciality: "Stomatologist",
  qualification: "MD, FACCD",
  bio: "Doctor bio",
  age: "45",
  available_days: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
};

const doctorFullName = doctorData.first_name + " " + doctorData.last_name;

const seedDoctor = async (session, departmentId) => {
  try {
    const existingDoctorUser = await User.findOne({
      email: doctorProfileData.email,
    });

    if (!existingDoctorUser) {
      const newDoctorUser = await User.create(
        [
          {
            ...doctorProfileData,
          },
        ],
        { session }
      );

      await Doctor.create(
        [
          {
            user_id: newDoctorUser[0]._id,
            department_id: departmentId,
            ...doctorData,
          },
        ],
        { session }
      );

      logger.info(`Doctor: ${doctorFullName} successfully created!`);
    } else {
      logger.error(`Doctor: ${doctorFullName} already exists!`);
    }
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};

module.exports = seedDoctor;
