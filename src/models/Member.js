const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      unique: true
    },
    rank: {
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
    state: {
      type: Boolean
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Member", MemberSchema);
