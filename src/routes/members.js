const express = require("express");
const { getClanInfo, updateClanRequirements } = require("../controllers/clans");
const { isAdmin } = require("../helper/apiAuth");

const router = express.Router();

router.route("/").get(getClanInfo);
// .post(addMember);

router.route("/:id").put(isAdmin, updateClanRequirements);
// .delete(isAdmin, removeMember)

module.exports = router;
