const express = require("express");
const { getPlayerStatsInfo } = require("../controllers/player");

const router = express.Router();

router.route("/:tag").get(getPlayerStatsInfo);

module.exports = router;
