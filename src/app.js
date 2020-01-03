const express = require("express");
const path = require("path");
// const { getApiVersion } = require("./helper/royaleApi");

const app = express();

app.get("/", (req, res) => {
  // console.log(req.params);
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// app.get("/about", (req, res) => {
//   res.sendFile(path.join(__dirname, "/public/index.html"));
// });

module.exports = app;
