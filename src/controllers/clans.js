const { updateClanRequirements } = require("../helper/serverApi");

// @desc Update clan requirements
// @route PUT /api/v1/members
// @access Private
exports.updateClanRequirements = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateClanRequirements(id.toLowerCase(), req.body);

    if (updated.message) throw new Error(updated.message);

    return res.status(200).json({
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};
