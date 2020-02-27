const axios = require("axios");
const { VENDOR_TOKEN, VENDOR_URL } = require("../config");

exports.getClanInfo2 = async clanTag => {
  try {
    const result = await axios.get(
      `${VENDOR_URL}/clans/${encodeURIComponent("#" + clanTag.toUpperCase())}`,
      {
        headers: {
          Authorization: `Bearer ${VENDOR_TOKEN}`
        }
      }
    );
    return result.data;
  } catch (error) {
    return error;
  }
};

exports.getPlayerStats2 = async playerTag => {
  try {
    const result = await axios.get(
      `${VENDOR_URL}/players/${encodeURIComponent(
        "#" + playerTag.toUpperCase()
      )}`,
      {
        headers: {
          Authorization: `Bearer ${VENDOR_TOKEN}`
        }
      }
    );

    return result.data;
  } catch (error) {
    console.info(
      `error on getPlayerStats2: player ${playerTag}`,
      error.message
    );
    console.info("----------------");
    return { error: error.message };
  }
};

exports.getClanWarLogs2 = async clanTag => {
  try {
    const result = await axios.get(`${VENDOR_URL}/clans/${clanTag}/warlog`, {
      headers: {
        Authorization: `Bearer ${VENDOR_TOKEN}`
      }
    });

    return result.data;
  } catch (error) {
    return error;
  }
};
