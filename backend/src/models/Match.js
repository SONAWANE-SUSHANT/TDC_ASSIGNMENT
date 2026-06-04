const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    matchedCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    breakdown: {
      age: Number,
      height: Number,
      income: Number,
      childrenPreference: Number,
      religion: Number,
      language: Number,
      location: Number,
      relocationPreference: Number,
      petsPreference: Number
    },
    explanation: { type: String, default: "" },
    introMessage: { type: String, default: "" },
    status: {
      type: String,
      enum: ["recommended", "sent", "accepted", "declined"],
      default: "recommended"
    },
    sentAt: Date,
    sentBy: { type: String, default: "Matchmaking Employee" },
    actionHistory: [
      {
        action: {
          type: String,
          enum: ["recommended", "sent", "accepted", "declined"],
          required: true
        },
        note: { type: String, default: "" },
        performedBy: { type: String, default: "Matchmaking Employee" },
        performedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

matchSchema.index({ customer: 1, matchedCustomer: 1 }, { unique: true });

module.exports = mongoose.model("Match", matchSchema);
