const express = require("express");
const { getMembers, addMember, putMembers } = require("../controllers/members");

const router = express.Router();

router
  .route("/")
  .get(getMembers)
  .post(addMember)
  .put(putMembers);

module.exports = router;
