const express = require("express");
const path = require("path");
const { getClan } = require("./helper/serverApi");

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Gavetas Community</title>
        <style>
          *,
          *::before,
          *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background-color: #0080ff;
            color: aliceblue;
            font-family: monospace;
            height: 100vh;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }
          a {color: aliceblue;}
        </style>
      </head>
      <body>
        <div>
          Check out the new site on <a href="https://gavetas-cr.netlify.com/">https://gavetas-cr.netlify.com/<a> 👍
        </div>
      </body>
    </html>
  `);
});

// app.get("/req", (req, res) => {
//   res.sendFile(path.join(__dirname, "/public/req.html"));
// });
// app.get("/clan/:clanTag", async (req, res) => {
//   const isClan = await getClan(req.params.clanTag);
//   if (isClan) return res.sendFile(path.join(__dirname, "/public/clan.html"));
//   return res.sendFile(path.join(__dirname, "/public/404.html"));
// });

module.exports = app;
