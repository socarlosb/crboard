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

exports.getApiMembers = async () => {
  try {
    const result = await axios.get(
      `${process.env.ROYALE_URL}/clan/8vlrrc28`,
      Auth
    );
    return result.data;
  } catch (error) {
    return error;
  }
};
