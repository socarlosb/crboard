const express = require("express");
const { getPlayerStatsInfo2 } = require("../controllers/player");

const router = express.Router();

router.route("/:tag").get(getPlayerStatsInfo2);

module.exports = router;
