const CronJob = require("cron").CronJob;
const { updateMembers } = require("./helper/serverApi");

const updateMembersJob = new CronJob(
  "* * * * *",
  function() {
    const now = new Date();
    updateMembers("8vlrrc28");
    console.log({ message: "Updating members list", time: now.toUTCString() });
  },
  null,
  true
);

module.exports = updateMembersJob;
