const express = require("express");
const { updateClanRequirements } = require("../controllers/clans");
const { isAdmin } = require("../helper/apiAuth");

const router = express.Router();

router.route("/").get(isAdmin, updateClanRequirements);

router.route("/:id").put(isAdmin, updateClanRequirements);

module.exports = router;
