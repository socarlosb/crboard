const CronJob = require("cron").CronJob;
const { updateClan } = require("./helper/serverApi");

const updateMembersJob = new CronJob(
  "0 */1 * * *",
  function() {
    const now = new Date();
    updateClan("8vlrrc28");
    console.log({ message: "Updating members list", time: now.toUTCString() });
  },
  null,
  true
);

module.exports = updateMembersJob;
