const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./modules/auth/auth.module"))
app.use("/api/admin", require("./modules/admin/admin.module"));

app.get("/", (req, res) => {
  res.send("Real Coffee API running");
});

module.exports = app;
