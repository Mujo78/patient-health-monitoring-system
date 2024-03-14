const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");

const patientSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    first_name: {
      type: String,
      required: [true, "First name is required!"],
      minlength: [2, "First name is too short!"],
    },
    last_name: {
      type: String,
      required: [true, "Last name is required!"],
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
        message: "Phone number must be valid!",
      },
    },
    address: {
      type: String,
      required: [true, "Address is required!"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required!"],
    },
    height: {
      type: String,
      required: false,
    },
    weight: {
      type: String,
      required: false,
    },
    blood_type: {
      type: String,
      required: [true, "Blood type is required!"],
    },
    date_of_birth: {
      type: String,
      required: [true, "Date of birth is required!"],
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.plugin(uniqueValidator, {
  message: "Phone number already used!",
});

patientSchema.pre("save", function (next) {
  if (this.isModified("date_of_birth")) {
    const dateOfBirth = new Date(this.date_of_birth);

    if (isNaN(dateOfBirth.getTime())) return next(new Error("Invalid date!"));

    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

    if (dateOfBirth > eighteenYearsAgo) {
      return next(new Error("You must be at least 18 years to register."));
    }
  }

  next();
});

patientSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user_id",
    select: "email photo",
  });

  next();
});

module.exports = mongoose.model("Patient", patientSchema);
