const express = require("express");
const { updateClanRequirements, getClanInfo } = require("../controllers/clans");
const { isAdmin } = require("../helper/apiAuth");

const router = express.Router();

// router.route("/").get(getClanInfo);

router
  .route("/:id")
  .get(getClanInfo)
  .put(isAdmin, updateClanRequirements);

module.exports = router;
