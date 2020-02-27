const axios = require("axios");
const { VENDOR_TOKEN, VENDOR_URL } = require("../config");

exports.getApiVersion = async () => {
  try {
    const result = await axios.get(`${process.env.VENDOR_URL_OLD}/version`, {
      headers: {
        auth: process.env.VENDOR_TOKEN_OLD
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
      `${process.env.VENDOR_URL_OLD}/clan/${clanTag}`,
      {
        headers: {
          auth: process.env.VENDOR_TOKEN_OLD
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
      `${process.env.VENDOR_URL_OLD}/player/${playerTag}`,
      {
        headers: {
          auth: process.env.VENDOR_TOKEN_OLD
        }
      }
    );

    return result.data;
  } catch (error) {
    console.info(`error on getPlayerStats: player ${playerTag}`, error.message);
    console.info("----------------");
    return { error: error.message };
  }
};

exports.getClanWarLogs = async clanTag => {
  try {
    const result = await axios.get(
      `${process.env.VENDOR_URL_OLD}/clan/${clanTag}/warlog`,
      {
        headers: {
          auth: process.env.VENDOR_TOKEN_OLD
        }
      }
    );

    return result.data;
  } catch (error) {
    return error;
  }
};
