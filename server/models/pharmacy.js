const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");

/**
 * @type {mongoose.SchemaDefinitionProperty}
 */
const pharmacySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required!"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Address is required!"],
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
    },
    phone_number: {
      type: String,
      required: [true, "Phone number is required!"],
      unique: true,
      maxlength: 12,
      validate: {
        validator: async function (value) {
          return validator.isMobilePhone(`${value}`);
        },
        message: "Phone number ({VALUE}) must be valid!",
      },
    },
    from: {
      type: Number,
      required: [true, "Starting hour is required!"],
      min: 1,
      max: 12,
    },
    to: {
      type: Number,
      required: [true, "Ending hour is required!"],
      min: 1,
      max: 12,
    },
  },
  {
    timestamps: true,
  }
);

pharmacySchema.plugin(uniqueValidator, {
  message: "Phone number already used!",
});

pharmacySchema.pre("save", async function (next) {
  const count = await this.constructor.countDocuments();
  if (count === 1) {
    throw new Error("You can add only one pharmacy!");
  }
  next();
});

module.exports = mongoose.model("Pharmacy", pharmacySchema);
