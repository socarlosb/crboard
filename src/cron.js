const CronJob = require("cron").CronJob;

const updateMembers = new CronJob("11 18 * * * *", function() {
  console.log("You will see this message every second");
});

module.exports = updateMembers;
