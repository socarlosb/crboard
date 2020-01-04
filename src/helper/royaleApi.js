const axios = require("axios");

exports.getApiVersion = async () => {
  try {
    const result = await axios.get(`${process.env.ROYALE_URL}/version`, {
      headers: {
        auth: process.env.ROYALE_TOKEN
      }
    });
    return result.data;
  } catch (error) {
    return error;
  }
};

exports.getClanInfo = async clanTag => {
  try {
    const result = await axios.get(
      `${process.env.ROYALE_URL}/clan/${clanTag}`,
      {
        headers: {
          auth: process.env.ROYALE_TOKEN
        }
      }
    );
    return result.data;
  } catch (error) {
    return error;
  }
};

exports.getPlayerStats = async playerTag => {
  try {
    const result = await axios.get(
      `${process.env.ROYALE_URL}/player/${playerTag}`,
      {
        headers: {
          auth: process.env.ROYALE_TOKEN
        }
      }
    );

    return result.data;
  } catch (error) {
    console.info(`error on getPlayerStats: player ${playerTag}`, error.message);
    console.info("----------------");
    return error;
  }
};

exports.getClanWarLogs = async clanTag => {
  try {
    const result = await axios.get(
      `${process.env.ROYALE_URL}/clan/${clanTag}/warlog`,
      {
        headers: {
          auth: process.env.ROYALE_TOKEN
        }
      }
    );

    return result.data;
  } catch (error) {
    return error;
  }
};
