const express = require("express");
const {
  updateClanRequirements,
  getClanInfo,
  getAllClans,
  getOutClanInfo,
  getClanWarnings,
} = require("../controllers/clans");
const { isAdmin } = require("../helper/apiAuth");

const router = express.Router();

router.route("/:id").get(getClanInfo).post(isAdmin, updateClanRequirements);
router.route("/out/:id").get(getOutClanInfo);
router.route("/warnings/:id").get(getClanWarnings);

router.route("/").get(getAllClans);

module.exports = router;
