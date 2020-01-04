const CronJob = require("cron").CronJob;
const { updateClan } = require("./helper/serverApi");
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const updateMembersJob = new CronJob(
  // "* * * * *",
  "0 */1 * * *",
  async function() {
    const now = new Date();
    const clans = JSON.parse(process.env.CLANS_LIST);

    await asyncForEach(clans, async clan => {
      console.log(`Preparing ${clan.toLowerCase()}`);
      await updateClan(clan.toLowerCase());
    });
    console.log({ message: "Updating clan list", time: now.toUTCString() });
  },
  null,
  true
);

const firstJob = async () => {
  console.log("testing job update");
  const now = new Date();
  const clans = JSON.parse(process.env.CLANS_LIST);

  await asyncForEach(clans, async clan => {
    console.log(`Preparing ${clan.toLowerCase()}`);
    await updateClan(clan.toLowerCase());
  });

  console.log({ message: "Updating clan list", time: now.toUTCString() });
};

module.exports = { updateMembersJob, firstJob };
