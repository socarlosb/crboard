const {
  updateClanRequirements,
  getClan,
  getClans,
} = require("../helper/serverApi");
const {
  asyncForEach,
  delay,
  getCardPercentage2,
  parseDate,
} = require("../helper/funcs");

const {
  getClanInfo2,
  getClanWarLogs2,
  getPlayerStats2,
} = require("../helper/vendorAPI");

// @desc Update clan requirements
// @route POST /api/v1/clan/:clanTag
// @access Private
exports.updateClanRequirements = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateClanRequirements(id.toLowerCase(), req.body);

    if (updated.message) throw new Error(updated.message);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error({ error: err.message });
    res
      .status(500)
      .json({ success: false, error: err.message || "Server error" });
  }
};

// @desc  Get all clan data
// @route GET /api/v1/clan/:clanTag
// @access Public
exports.getClanInfo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const clan = await getClan(id);

    if (!clan) throw new Error("Clan not found");

    return res.status(200).json({
      success: true,
      count: clan.length,
      data: clan,
    });
  } catch (err) {
    console.error({ error: err.message });
    res
      .status(404)
      .json({ success: false, error: err.message || "Server error" });
  }
};

// @desc  Get all clans data
// @route GET /api/v1/clan/
// @access Public
exports.getAllClans = async (req, res, next) => {
  try {
    const clans = await getClans();

    return res.status(200).json({
      success: true,
      count: clans.length,
      data: clans,
    });
  } catch (err) {
    console.error({ error: err.message });
    res
      .status(404)
      .json({ success: false, error: err.message || "Server error" });
  }
};

// @desc  Get all clan data
// @route GET /api/v1/clan/out/:clanTag
// @access Public
exports.getOutClanInfo = async (req, res, next) => {
  try {
    const { id: clanTag } = req.params;

    // const clan = await getClanInfo2(id);

    // if (!clan) throw new Error("Clan not found");

    // return res.status(200).json({
    //   success: true,
    //   data: clan,
    // });

    await delay(`Getting Clan Info for ${clanTag}`, 1000);

    const {
      memberList,
      name,
      description,
      clanScore,
      clanWarTrophies,
      members,
      requiredTrophies,
    } = await getClanInfo2(clanTag);
    if (!memberList) throw new Error(`Royale API connection failed!`);
    const clanWarLogs = await getClanWarLogs2(clanTag);
    await delay(`Getting Clan War Logs: ${name}`, 1000);

    const inClanMembers = [];
    await asyncForEach(memberList, async (member) => {
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
        donations,
      } = member;

      inClanMembers.push({
        tag,
        rank: clanRank,
        previousClanRank,
        name,
        role,
        trophies,
        donations,
        ...memberStats,
      });
    });

    await delay(`Updating internal clan ${name} (${clanTag})`, 1000);

    let lastWarDate = "";
    if (clanWarLogs[0] && clanWarLogs[0].createdDate)
      lastWarDate = parseDate(clanWarLogs[0].createdDate);

    const clan = {
      tag: clanTag.toLowerCase(),
      name,
      description,
      lastWarDate,
      score: clanScore,
      warTrophies: clanWarTrophies,
      memberCount: members,
      requiredScore: requiredTrophies,
      members: inClanMembers,
    };
    return res.status(200).json({
      success: true,
      data: clan,
    });
  } catch (err) {
    console.error({ error: err.message });
    res
      .status(404)
      .json({ success: false, error: err.message || "Server error" });
  }
};

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
        bronze: getCardPercentage2(playerStats.cards, 9, cardsFound),
      },
    },
    warStats: warLogs,
  };
};
const getClanWarWinRate = async (clanWarLogs, playerTag) => {
  const warStats = {
    cardsEarned: 0,
    battleCount: 0,
    battlesPlayed: 0,
    battlesMissed: 0,
    battlesExtra: 0,
    wins: 0,
    collectionDayBattlesPlayed: 0,
  };

  clanWarLogs.map((war) => {
    war.participants.map((player) => {
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

exports.getClanWarnings = async (req, res, next) => {
  try {
    const { id: clanTag } = req.params;
    let { warrate } = req.query;

    if (!warrate) warrate = 0;
    console.info("warrate", warrate);
    console.info("----------------");

    const clanInfo = await getClanInfo2(clanTag);
    const memberList = parseMembers(clanInfo);
    const warInfo = await getClanWarLogs2(clanTag);
    if (!warInfo) throw new Error("No data found!");

    const warningsList = [];

    memberList.map((item) => {
      const member = {
        name: item.name,
        tag: item.tag,
        missedBattles: 0,
        missedCollections: 0,
        winRate: 0,
        warnings: 0,
        warningsNotes: [],
      };

      let participatedWars = 0;
      let totalWins = 0;

      warInfo.map((war) => {
        war["participants"].map((el) => {
          if (el.tag === item.tag) {
            const warDate = war.createdDate.split("T")[0];
            const warDateDay = warDate.substr(4, 2);
            const warDateMonth = warDate.substr(6, 2);
            const dateToShow = `${warDateMonth}/${warDateDay}`;

            if (el.battlesPlayed < el.numberOfBattles) {
              member.missedBattles += el.numberOfBattles - el.battlesPlayed;
              member["warningsNotes"].push(
                `Falhou batalha final em ${dateToShow}`
              );
              member.warnings += 1;
            }

            if (el.collectionDayBattlesPlayed < 3) {
              member.missedCollections += 1;
              member["warningsNotes"].push(`Falhou Coleta em ${dateToShow}`);
              member.warnings += 1;
            }

            if (el.numberOfBattles > 0) {
              participatedWars += el.numberOfBattles;
              totalWins += el.wins;
            }
          }
        });
      });
      const winRate = participatedWars
        ? (
            (totalWins / (participatedWars + member.missedBattles)) *
            100
          ).toFixed(0)
        : 0;

      if (participatedWars > 0 && winRate < parseInt(warrate)) {
        member.winRate = winRate;
        member["warningsNotes"].push(`Win Rate menor que 50% (${winRate}%)`);
        member.warnings += 1;
      }
      if (member.warnings > 0) {
        warningsList.push(member);
      }
    });

    return res.status(200).json({
      success: true,
      data: warningsList,
    });
  } catch (error) {
    console.error({ error: error });
    res
      .status(404)
      .json({ success: false, error: error.message || "Server error" });
  }
};

function parseMembers(clanInfo) {
  return clanInfo["memberList"].map((item) => {
    return {
      name: item.name,
      tag: item.tag,
    };
  });
}
