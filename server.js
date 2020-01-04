const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const { updateMembersJob, firstJob } = require("./src/cron");

dotenv.config({ path: "./src/config/config.env" });
const connectDB = require("./src/config/db");

const app = require("./src/app");

connectDB();

//cron job
updateMembersJob;

app.use(express.json());

app.use(express.static(path.join(__dirname, "src", "public")));

app.use("/api/v1/clan", require("./src/routes/clan"));

const PORT = process.env.PORT || 3000;

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/src/public/404.html"));
});

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

  // also for testing
  firstJob();
});
