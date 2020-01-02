const CronJob = require("cron").CronJob;
const { putMembers } = require("./controllers/members");

const updateMembers = new CronJob(
  "44 18 * * * *",
  function() {
    const now = new Date();
    console.log({ message: "Updating members list", time: now.toUTCString() });
    putMembers;
  },
  null,
  true
);

module.exports = updateMembers;
