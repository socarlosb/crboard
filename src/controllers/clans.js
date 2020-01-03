const { updateClanRequirements, getClan } = require("../helper/serverApi");

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

// @desc  Get all clan data
// @route GET /api/v1/clan
// @access Public
exports.getClanInfo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const clan = await getClan(id);

    return res.status(200).json({
      success: true,
      count: clan.length,
      data: clan
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
