const express = require("express");
const {
  updateClanRequirements,
  getClanInfo,
  getAllClans
} = require("../controllers/clans");
const { isAdmin } = require("../helper/apiAuth");

const router = express.Router();

// router.route("/").get(getClanInfo);

router
  .route("/:id")
  .get(getClanInfo)
  .post(isAdmin, updateClanRequirements);

router.route("/").get(getAllClans);

module.exports = router;
