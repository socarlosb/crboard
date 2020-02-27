const mongoose = require("mongoose");
const { ClanRequirementsSchema } = require("./ClanRequirements");

exports.MemberSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      unique: true
    },
    rank: {
      type: Number
    },
    previousClanRank: {
      type: Number
    },
    name: {
      type: String
    },
    role: {
      type: String
    },
    trophies: {
      type: Number
    },
    donations: {
      type: Number
    },
    stats: {
      type: ClanRequirementsSchema,
      default: {}
    },
    warStats: {
      cardsEarned: { type: Number, default: 0 },
      battleCount: { type: Number, default: 0 },
      battlesPlayed: { type: Number, default: 0 },
      battlesMissed: { type: Number, default: 0 },
      battlesExtra: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      collectionDayBattlesPlayed: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);
