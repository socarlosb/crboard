const mongoose = require("mongoose");

exports.ClanRequirementsSchema = new mongoose.Schema(
  {
    warWinRate: {
      type: Number
    },
    requiredTrophies: {
      type: Number
    },
    warDayWins: {
      type: Number
    },
    cardLevels: {
      max: { type: String },
      legend: { type: String },
      gold: { type: String },
      silver: { type: String },
      bronze: { type: String }
    }
  },
  {
    timestamps: true
  }
);
