const mongoose = require("mongoose");

const lawyerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      // required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    skills: [{ type: String, required: true }],
    experience: {
      type: String,
      required: true,
    },
    feePerConsultation: {
      type: Number,
      required: true,
    },
    timings: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    lastUpdated: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const lawyerModel = mongoose.model("lawyers", lawyerSchema);
module.exports = lawyerModel;
