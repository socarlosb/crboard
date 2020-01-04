const express = require("express");
const path = require("path");
const { getClan } = require("./helper/serverApi");

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/:clanTag", async (req, res) => {
  const isClan = await getClan(req.params.clanTag);
  if (isClan) return res.sendFile(path.join(__dirname, "/public/clan.html"));
  return res.sendFile(path.join(__dirname, "/public/404.html"));
});

module.exports = app;
