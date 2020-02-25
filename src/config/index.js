module.exports = {
  PORT: process.env.PORT || 4444,
  NODE_ENV: process.env.NODE_ENV || "Development",
  VENDOR_URL: process.env.VENDOR_URL,
  VENDOR_TOKEN: process.env.VENDOR_TOKEN,
  MONGO_URI: process.env.MONGO_URI,
  CLANS_LIST: process.env.CLANS_LIST,
  SERVER_PASS: process.env.SERVER_PASS || "pass123"
};
