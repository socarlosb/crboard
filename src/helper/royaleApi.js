const axios = require("axios");
const { VENDOR_TOKEN, VENDOR_URL } = require("../config");

exports.getApiVersion = async () => {
  try {
    const result = await axios.get(`${VENDOR_URL}/version`, {
      headers: {
        auth: VENDOR_TOKEN
      }
    });
    return result.data;
  } catch (error) {
    return error;
  }
};

exports.getClanInfo = async clanTag => {
  try {
    const result = await axios.get(`${VENDOR_URL}/clan/${clanTag}`, {
      headers: {
        auth: VENDOR_TOKEN
      }
    });
    return result.data;
  } catch (error) {
    return error;
  }
};

exports.getPlayerStats = async playerTag => {
  try {
    const result = await axios.get(`${VENDOR_URL}/player/${playerTag}`, {
      headers: {
        auth: VENDOR_TOKEN
      }
    });

    return result.data;
  } catch (error) {
    console.info(`error on getPlayerStats: player ${playerTag}`, error.message);
    console.info("----------------");
    return { error: error.message };
  }
};

exports.getClanWarLogs = async clanTag => {
  try {
    const result = await axios.get(`${VENDOR_URL}/clan/${clanTag}/warlog`, {
      headers: {
        auth: VENDOR_TOKEN
      }
    });

    return result.data;
  } catch (error) {
    return error;
  }
};
