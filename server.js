const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const { updateMembersJob, firstJob } = require("./src/cron");
const { NODE_ENV, PORT } = require("./src/config");

const connectDB = require("./src/config/db");
const app = require("./src/app");

connectDB();

//cron job
if (NODE_ENV !== "Development") updateMembersJob;

app.use(express.json());
app.use(cors());

// app.use(express.static(path.join(__dirname, "src", "public")));

app.use("/api/v1/clan", require("./src/routes/clan"));
app.use("/api/v1/player", require("./src/routes/player"));

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/src/public/404.html"));
});

app.listen(PORT, async () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);

  // also for testing
  if (NODE_ENV !== "Development") firstJob();
});
