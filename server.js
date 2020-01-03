const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
// const { updateMembersJob } = require("./src/cron");

dotenv.config({ path: "./src/config/config.env" });
const connectDB = require("./src/config/db");

const app = require("./src/app");

connectDB();

//cron jobs
// updateMembersJob;

app.use(express.json());

app.use(express.static(path.join(__dirname, "src", "public")));

app.use("/api/v1/members", require("./src/routes/members"));
app.use("/api/v1/clan", require("./src/routes/clan"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
