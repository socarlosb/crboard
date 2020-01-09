const { getPlayerStats } = require("../helper/royaleApi");

const player = {
  name: "",
  tag: "",
  clan: "",
  clanTag: "",
  level: 0,
  trophies: 0,
  allWinRate: 0,
  warDayWins: 0,
  warWinRate: 0,
  warAvgCollections: 0,
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
    player.warWinRate = "???";
    player.warAvgCollections = "???";
    player.warDayWins = "???";
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

const getCardPercentage = (cards, level, maxCards) => {
  const totalCards = cards.reduce((acc, current) => {
    if (current.displayLevel >= level) acc++;
    return acc;
  }, 0);
  return (totalCards / maxCards).toFixed(2);
};
