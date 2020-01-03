const express = require("express");
const {
  getMembers,
  addMember,
  putMembers,
  removeMember
} = require("../controllers/members");
const { isAdmin } = require("../helper/apiAuth");

const router = express.Router();

router
  .route("/")
  .get(getMembers)
  .post(addMember);

router
  .route("/:id")
  .delete(isAdmin, removeMember)
  .put(putMembers);

module.exports = router;
