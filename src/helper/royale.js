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
    console.log("result", `${process.env.ROYALE_URL}clan/8vlrrc28`);
    console.log("auth", Auth);
    const result = await axios.get(`${process.env.ROYALE_URL}/clan/8vlrrc28`, {
      headers: {
        auth: process.env.ROYALE_TOKEN
      }
    });

    return result.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
