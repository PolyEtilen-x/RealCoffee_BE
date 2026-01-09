const express = require("express");
const cors = require("cors");

const app = express();
const { checkAuth } = require("./middleware/auth.middleware");

app.get("/api/test-auth", checkAuth, (req, res) => {
  res.json({
    message: "Auth OK",
    user: req.user
  });
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./modules/auth/auth.module"))
app.get("/", (req, res) => {
  res.send("Real Coffee API running");
});

module.exports = app;
