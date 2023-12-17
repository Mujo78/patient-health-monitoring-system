const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      maxlength: 100,
      validate: [validator.isEmail, "Please provide valid email!"],
    },
    role: {
      type: String,
      enum: ["DOCTOR", "HOSPITAL", "PATIENT", "PHARMACY"],
      required: [true, "Role is required!"],
    },
    photo: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: 5,
      select: false,
    },
    first: {
      type: Boolean,
      default: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Confirm password is required!"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Paswords are not the same!",
      },
      select: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    notification: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator, { message: "Email already used!" });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  typedPassword,
  userPassword
) {
  return await bcrypt.compare(typedPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createVerificationToken = function () {
  const newVerificationToken = crypto.randomBytes(32).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256")
    .update(newVerificationToken)
    .digest("hex");
  this.verificationTokenExpires = Date.now() + 2 * 60 * 60 * 1000;

  return newVerificationToken;
};

module.exports = mongoose.model("User", userSchema);
