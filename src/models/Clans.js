const mongoose = require("mongoose");
const { MemberSchema } = require("./Member");
const { ClanRequirementsSchema } = require("./ClanRequirements");

const ClanSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      unique: true
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    score: {
      type: Number
    },
    warTrophies: {
      type: Number
    },
    memberCount: {
      type: Number
    },
    requiredScore: {
      type: Number
    },
    isActive: {
      type: Boolean,
      default: true
    },
    members: {
      type: [MemberSchema]
    },
    clanRequirements: {
      type: ClanRequirementsSchema
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Clan", ClanSchema);
