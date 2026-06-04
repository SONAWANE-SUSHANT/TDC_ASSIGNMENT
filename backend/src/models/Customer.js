const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true, min: 18, max: 80 },
    country: { type: String, default: "India" },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    height: { type: Number, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    undergraduateCollege: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    education: { type: String, required: true, trim: true },
    income: { type: Number, required: true },
    currentCompany: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    profession: { type: String, required: true, trim: true },
    maritalStatus: {
      type: String,
      enum: ["Never Married", "Divorced", "Widowed", "Separated"],
      required: true
    },
    languagesKnown: [{ type: String, trim: true }],
    languages: [{ type: String, trim: true }],
    siblings: { type: Number, min: 0, max: 6, default: 0 },
    caste: { type: String, required: true, trim: true },
    religion: { type: String, required: true, trim: true },
    wantKids: { type: String, enum: ["Yes", "No", "Open"], required: true },
    childrenPreference: { type: String, enum: ["Yes", "No", "Open"], required: true },
    openToRelocate: { type: String, enum: ["Yes", "No", "Open"], required: true },
    relocationPreference: { type: String, enum: ["Yes", "No", "Open"], required: true },
    openToPets: { type: String, enum: ["Yes", "No", "Open"], required: true },
    petsPreference: { type: String, enum: ["Yes", "No", "Open"], required: true },
    statusTag: {
      type: String,
      enum: ["New", "Verified", "Premium", "Shortlisted", "Needs Review"],
      default: "New"
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["New", "Verified", "Premium", "Shortlisted", "Needs Review"],
          required: true
        },
        note: { type: String, default: "" },
        changedBy: { type: String, default: "System" },
        changedAt: { type: Date, default: Date.now }
      }
    ],
    bio: { type: String, default: "" }
  },
  { timestamps: true }
);

customerSchema.index({ firstName: "text", lastName: "text", city: "text", profession: "text" });

module.exports = mongoose.model("Customer", customerSchema);
