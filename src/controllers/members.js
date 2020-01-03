const { updateClan } = require("../helper/serverApi");

// @desc Update members from external API
// @route PUT /api/v1/members
// @access Private
exports.putMembers = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await updateClan(id.toLowerCase());

    if (updated.message) throw new Error(updated.message);

    return res.status(200).json({
      success: true
    });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// // @desc  Create a member
// // @route POST /api/v1/members
// // @access Public
// exports.addMember = async (req, res, next) => {
//   try {
//     const member = await Member.create(req.body);

//     return res.status(200).json({
//       success: true,
//       data: member
//     });
//   } catch (err) {
//     console.error(err);
//     if (err.code === 11000) {
//       return res.status(400).json({ error: "This member already exists" });
//     }
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // @desc  Remove a member
// // @route DELETE /api/v1/members/$id
// // @access Public
// exports.removeMember = async (req, res, next) => {
//   try {
//     const member = await Member.deleteOne({ _id: req.params.id });
//     if (member.deletedCount === 0)
//       throw new Error(`Member with id ${req.params.id} was not found`);

//     return res.status(200).json({
//       success: true,
//       message: "Member removed"
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
