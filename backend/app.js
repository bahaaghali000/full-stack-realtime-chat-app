const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");

app.use(express.json({ limit: Infinity }));
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({ msg: "Hello" });
});

module.exports = app;
