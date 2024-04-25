const Medicine = require("../models/medicine");
const logger = require("../utils/logger");

const medicineData = {
  name: "Prozac",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
  photo: "prozac-200.png",
  available: true,
  strength: "20",
  category: "Other",
  price: "100",
  manufacturer: "UK, London",
};

const seedMedicine = async (session, pharmacyId) => {
  try {
    const existingMedicine = await Medicine.findOne({
      name: medicineData.name,
    });

    if (!existingMedicine) {
      const newMedicine = await Medicine.create(
        [
          {
            pharmacy_id: pharmacyId,
            ...medicineData,
          },
        ],
        { session }
      );

      logger.info(`Medicine: ${newMedicine[0].name} successfully created!`);
    } else {
      logger.error(`Medicine: ${medicineData.name} already exists!`);
    }
  } catch (error) {
    logger.error(error);
    throw new Error(error);
  }
};

module.exports = seedMedicine;
