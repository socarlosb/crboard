const CronJob = require("cron").CronJob;
const { updateClan } = require("./helper/serverApi");
const { CLANS_LIST } = require("./config");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const updateMembersJob = new CronJob(
  // "* * * * *",
  "0 */1 * * *",
  async function() {
    console.time("update job");

    const now = new Date();
    const clans = JSON.parse(CLANS_LIST);

    await asyncForEach(clans, async clan => {
      console.log(`Preparing ${clan.toLowerCase()}`);
      await updateClan(clan.toLowerCase());
    });
    console.log({ message: "Updating clan list", time: now.toUTCString() });
    console.timeEnd("update job");
  },
  null,
  true
);

const firstJob = async () => {
  console.time("job");
  console.log("First job update");
  const now = new Date();
  const clans = JSON.parse(CLANS_LIST);

  await asyncForEach(clans, async clan => {
    console.log(`Preparing ${clan.toLowerCase()}`);
    await updateClan(clan.toLowerCase());
  });

  console.log({ message: "Updating clan list", time: now.toUTCString() });
  console.timeEnd("job");
};

module.exports = { updateMembersJob, firstJob };
