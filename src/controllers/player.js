const { getPlayerStats } = require("../helper/royaleApi");
const { getPlayerStats2 } = require("../helper/vendorAPI");
const { getCardPercentage2, getCardPercentage } = require("../helper/funcs");

const player = {
  name: "",
  tag: "",
  clan: "",
  clanTag: "",
  level: 0,
  trophies: 0,
  allWinRate: 0,
  warDayWins: 0,
  cardLevels: {
    max: 0,
    legend: 0,
    gold: 0,
    silver: 0,
    bronze: 0
  }
};

// @desc  Get an player stats
// @route GET /api/v1/player/:playerTag
// @access Public
exports.getPlayerStatsInfo = async (req, res, next) => {
  try {
    const { tag } = req.params;
    const playerStats = await getPlayerStats(tag);
    if (playerStats.error) throw new Error("Player not found!");

    const { stats, name, trophies, games, cards, clan } = playerStats;

    player.clan = clan.name || "";
    player.clanTag = clan.tag || "";
    player.level = stats.level;
    player.tag = tag;
    player.trophies = trophies;
    player.name = name;
    player.allWinRate = (
      (games.wins / (games.wins + games.losses)) *
      100
    ).toFixed(0);
    player.warDayWins = games.warDayWins;
    player.cardLevels.max = getCardPercentage(cards, 13, stats.cardsFound);
    player.cardLevels.legend = getCardPercentage(cards, 12, stats.cardsFound);
    player.cardLevels.gold = getCardPercentage(cards, 11, stats.cardsFound);
    player.cardLevels.silver = getCardPercentage(cards, 10, stats.cardsFound);
    player.cardLevels.bronze = getCardPercentage(cards, 9, stats.cardsFound);

    return res.status(200).json(player);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ err: err.message });
  }
};

// @desc  Get an player stats
// @route GET /api/v2/players/:playerTag
// @access Public
exports.getPlayerStatsInfo2 = async (req, res) => {
  try {
    const { tag } = req.params;
    const playerStats = await getPlayerStats2(tag);

    if (playerStats.reason) throw new Error("Player not found!");

    const cardsFound = playerStats.cards.length;

    player.clan = playerStats.clan.name || "";
    player.clanTag = playerStats.clan.tag.split("#")[1] || "";
    player.level = playerStats.expLevel;
    player.tag = playerStats.tag.split("#")[1];
    player.trophies = playerStats.trophies;
    player.name = playerStats.name;
    player.allWinRate = (
      (playerStats.wins / (playerStats.wins + playerStats.losses)) *
      100
    ).toFixed(0);
    player.warDayWins = playerStats.warDayWins;
    player.cardLevels.max = getCardPercentage2(
      playerStats.cards,
      13,
      cardsFound
    );
    player.cardLevels.legend = getCardPercentage2(
      playerStats.cards,
      12,
      cardsFound
    );
    player.cardLevels.gold = getCardPercentage2(
      playerStats.cards,
      11,
      cardsFound
    );
    player.cardLevels.silver = getCardPercentage2(
      playerStats.cards,
      10,
      cardsFound
    );
    player.cardLevels.bronze = getCardPercentage2(
      playerStats.cards,
      9,
      cardsFound
    );

    return res.status(200).json(player);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ err: err.message });
  }
};
