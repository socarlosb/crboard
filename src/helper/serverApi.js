// const Member = require("../models/Member");
const Clans = require("../models/Clans");
const {
  getClanInfo,
  getPlayerStats,
  getClanWarLogs
} = require("../helper/royaleApi");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const delay = (message, time) => {
  return new Promise(resolve => {
    setTimeout(function() {
      const now = new Date();
      resolve(console.info(`${message}, ${now.toLocaleString()}`));
    }, time);
  });
};

exports.updateClan = async clanTag => {
  try {
    await delay(`Getting Clan Info for ${clanTag}`, 10000);

    const {
      members,
      name,
      description,
      score,
      warTrophies,
      memberCount,
      requiredScore
    } = await getClanInfo(clanTag);

    if (!members) throw new Error(`Royale API connection failed!`);

    const clanWarLogs = await getClanWarLogs(clanTag);
    await delay(`Getting Clan War Logs for ${clanTag}`, 10000);

    const inClanMembers = await asyncForEach(members, async member => {
      await delay(`Getting player info stats of ${member.tag}`, 10000);
      const memberStats = await getPlayerInfo(member.tag, clanWarLogs);
      const { tag, rank, name, role, trophies, donations } = member;

      return {
        tag,
        rank,
        name,
        role,
        trophies,
        donations,
        ...memberStats
      };
    });

    await delay(`Updating internal clan ${clanTag}`, 10000);

    const activeMembers = await Promise.all(inClanMembers);

    const clan = await Clans.findOneAndUpdate(
      { tag: clanTag },
      {
        $set: {
          tag: clanTag.toLowerCase(),
          name,
          description,
          score,
          warTrophies,
          memberCount,
          requiredScore,
          members: activeMembers
        }
      },
      { new: true, upsert: true }
    );
    return clan;
  } catch (err) {
    console.info("err", err);
    console.info("----------------");
    return err;
  }
};

const getPlayerInfo = async (playerTag, clanWarLogs) => {
  const { games, cards, stats } = await getPlayerStats(playerTag);

  const warLogs = await getClanWarWinRate(clanWarLogs, playerTag);

  let winRate = 0;
  if (warLogs.battleCount > 0) winRate = warLogs.wins / warLogs.battleCount;

  return {
    stats: {
      warWinRate: winRate.toFixed(2),
      warDayWins: games.warDayWins,
      cardLevels: {
        max: getCardPercentage(cards, 13, stats.cardsFound),
        legend: getCardPercentage(cards, 12, stats.cardsFound),
        gold: getCardPercentage(cards, 11, stats.cardsFound),
        silver: getCardPercentage(cards, 10, stats.cardsFound),
        bronze: getCardPercentage(cards, 9, stats.cardsFound)
      }
    },
    warStats: warLogs
  };
};

const getCardPercentage = (cards, level, maxCards) => {
  const totalCards = cards.reduce((acc, current) => {
    if (current.displayLevel >= level) acc++;
    return acc;
  }, 0);
  return (totalCards / maxCards).toFixed(2);
};

const getClanWarWinRate = async (clanWarLogs, playerTag) => {
  const warStats = {
    cardsEarned: 0,
    battleCount: 0,
    battlesPlayed: 0,
    battlesMissed: 0,
    wins: 0,
    collectionDayBattlesPlayed: 0
  };

  clanWarLogs.map(war => {
    war.participants.map(player => {
      if (player.tag === playerTag) {
        warStats.cardsEarned += player.cardsEarned;
        warStats.battleCount += player.battleCount;
        warStats.battlesPlayed += player.battlesPlayed;
        warStats.battlesMissed += player.battlesMissed;
        warStats.wins += player.wins;
        warStats.collectionDayBattlesPlayed +=
          player.collectionDayBattlesPlayed;
      }
    });
  });
  return warStats;
};

exports.updateClanRequirements = async (clanTag, requirements) => {
  try {
    const updatedClanInfo = await Clans.findOneAndUpdate(
      { tag: clanTag },
      { clanRequirements: requirements },
      { new: true }
    );
    return updatedClanInfo;
  } catch (error) {
    return error;
  }
};

exports.getClan = async clanTag => {
  try {
    const clan = await Clans.findOne({ tag: clanTag.toLowerCase() }).sort({
      rank: 1
    });
    return clan;
  } catch (error) {
    return error;
  }
};

exports.getClans = async clanTag => {
  try {
    const clan = await Clans.find({}).sort({
      warTrophies: -1
    });
    return clan;
  } catch (error) {
    return error;
  }
};
