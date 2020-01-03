const express = require("express");
const { getApiVersion } = require("./helper/royaleApi");

const app = express();

app.get("/v", async function(req, res) {
  try {
    const apiVersion = await getApiVersion();

    if (apiVersion.code) throw new Error(apiVersion.code);

    return res.json({ success: true, version: apiVersion.version });
  } catch (error) {
    if (error.message === "ERR_HTTP_INVALID_HEADER_VALUE")
      return res.status(400).json({
        error: "API token not found"
      });
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = app;
