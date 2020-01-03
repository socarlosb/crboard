const axios = require("axios");

const Auth = {
  headers: {
    auth: process.env.ROYALE_TOKEN
  }
};

exports.getApiVersion = async () => {
  try {
    const result = await axios.get(`${process.env.ROYALE_URL}/version`, Auth);
    return result.data;
  } catch (error) {
    return error;
  }
};

exports.getClanInfo = async clanTag => {
  try {
    const result = await axios.get(
      `${process.env.ROYALE_URL}/clan/${clanTag}`,
      Auth
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
      Auth
    );

    return result.data;
  } catch (error) {
    return error;
  }
};

exports.getClanWarLogs = async clanTag => {
  try {
    const result = await axios.get(
      `${process.env.ROYALE_URL}/clan/${clanTag}/warlog`,
      Auth
    );

    return result.data;
  } catch (error) {
    return error;
  }
};
