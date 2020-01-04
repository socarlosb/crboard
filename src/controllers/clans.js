const {
  updateClanRequirements,
  getClan,
  getClans
} = require("../helper/serverApi");

// @desc Update clan requirements
// @route POST /api/v1/clan/:clanTag
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
// @route GET /api/v1/clan/:clanTag
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

// @desc  Get all clans data
// @route GET /api/v1/clan/
// @access Public
exports.getAllClans = async (req, res, next) => {
  try {
    const clans = await getClans();

    return res.status(200).json({
      success: true,
      count: clans.length,
      data: clans
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
