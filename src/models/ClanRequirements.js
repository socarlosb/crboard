const mongoose = require("mongoose");

exports.ClanRequirementsSchema = new mongoose.Schema(
  {
    warWinRate: {
      type: Number
    },
    allWinRate: {
      type: Number
    },
    requiredTrophies: {
      type: Number
    },
    warDayWins: {
      type: Number
    },
    warAvgCollections: {
      type: Number
    },
    level: {
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
