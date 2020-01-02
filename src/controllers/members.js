const Member = require("../models/Member");
const { getApiMembers } = require("../helper/royale");

// @desc  Update members from external API
// @route PUT /api/v1/members
// @access Private
exports.putMembers = async (req, res, next) => {
  try {
    const { members } = await getApiMembers();
    console.log(members);
    members.map(async member => {
      const newMember = await Member.findOneAndUpdate(
        { tag: member.tag },
        { ...member, state: true },
        { new: true, upsert: true }
      );
      console.log("newMember", newMember);
    });

    return res.status(200).json({
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc  Get all members
// @route GET /api/v1/members
// @access Public
exports.getMembers = async (req, res, next) => {
  try {
    const members = await Member.find({}).sort({ rank: 1 });

    return res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc  Create a member
// @route POST /api/v1/members
// @access Public
exports.addMember = async (req, res, next) => {
  try {
    const member = await Member.create(req.body);

    return res.status(200).json({
      success: true,
      data: member
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "This member already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};
