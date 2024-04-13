const mongoose = require("mongoose");

/**
 * @type {mongoose.SchemaDefinitionProperty}
 */
const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required!"],
      minlength: 5,
      maxlength: 120,
    },
    content: {
      type: String,
      required: [true, "Content is required!"],
    },
    type: {
      type: String,
      enum: ["MESSAGE", "ALERT", "INFO"],
      required: [true, "Type is required!"],
    },
    link: {
      type: String,
      required: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
