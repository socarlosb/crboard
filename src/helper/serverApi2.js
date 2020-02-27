const Clans = require("../models/Clans");
const {
  getClanInfo2,
  getClanWarLogs2,
  getPlayerStats2
} = require("../helper/vendorAPI");
const { asyncForEach, delay, getCardPercentage2 } = require("./funcs");

exports.updateClan = async clanTag => {
  try {
    await delay(`Getting Clan Info for ${clanTag}`, 1000);

    const {
      memberList,
      name,
      description,
      clanScore,
      clanWarTrophies,
      members,
      requiredTrophies
    } = await getClanInfo2(clanTag);

    if (!memberList) throw new Error(`Royale API connection failed!`);

    const clanWarLogs = await getClanWarLogs2(clanTag);
    await delay(`Getting Clan War Logs: ${name}`, 1000);

    const inClanMembers = [];

    await asyncForEach(memberList, async member => {
      await delay(
        `Getting player info stats ${member.name} (${member.tag})`,
        1000
      );
      const memberStats = await getPlayerInfo(
        member.tag.split("#")[1],
        clanWarLogs
      );
      const {
        tag,
        clanRank,
        previousClanRank,
        name,
        role,
        trophies,
        donations
      } = member;

      inClanMembers.push({
        tag,
        rank: clanRank,
        previousClanRank,
        name,
        role,
        trophies,
        donations,
        ...memberStats
      });
    });

    await delay(`Updating internal clan ${name} (${clanTag})`, 1000);

    const clan = await Clans.findOneAndUpdate(
      { tag: clanTag },
      {
        $set: {
          tag: clanTag.toLowerCase(),
          name,
          description,
          score: clanScore,
          warTrophies: clanWarTrophies,
          memberCount: members,
          requiredScore: requiredTrophies,
          members: inClanMembers
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

// to confirm
const getPlayerInfo = async (playerTag, clanWarLogs) => {
  const playerStats = await getPlayerStats2(playerTag);

  const warLogs = await getClanWarWinRate(clanWarLogs, playerTag);

  let winRate = 0;

  if (warLogs.battleCount > 0)
    winRate = warLogs.wins / (warLogs.battleCount + warLogs.battlesExtra);

  const cardsFound = playerStats.cards.length;

  return {
    stats: {
      warWinRate: winRate.toFixed(2),
      warDayWins: playerStats.warDayWins,
      allWinRate: (
        (playerStats.wins / (playerStats.wins + playerStats.losses)) *
        100
      ).toFixed(0),
      level: playerStats.expLevel,
      cardLevels: {
        max: getCardPercentage2(playerStats.cards, 13, cardsFound),
        legend: getCardPercentage2(playerStats.cards, 12, cardsFound),
        gold: getCardPercentage2(playerStats.cards, 11, cardsFound),
        silver: getCardPercentage2(playerStats.cards, 10, cardsFound),
        bronze: getCardPercentage2(playerStats.cards, 9, cardsFound)
      }
    },
    warStats: warLogs
  };
};

// to confirm
const getClanWarWinRate = async (clanWarLogs, playerTag) => {
  const warStats = {
    cardsEarned: 0,
    battleCount: 0,
    battlesPlayed: 0,
    battlesMissed: 0,
    battlesExtra: 0,
    wins: 0,
    collectionDayBattlesPlayed: 0
  };

  clanWarLogs.map(war => {
    war.participants.map(player => {
      const battlesMissed = player.numberOfBattles - player.battlesPlayed;
      if (player.tag === `#${playerTag}`) {
        warStats.cardsEarned += player.cardsEarned;
        if (player.numberOfBattles > 1) {
          warStats.battleCount += 1;
          warStats.battlesExtra += 1;
        } else {
          warStats.battleCount += player.numberOfBattles;
        }
        warStats.battlesPlayed += player.battlesPlayed;
        warStats.battlesMissed += battlesMissed;
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
