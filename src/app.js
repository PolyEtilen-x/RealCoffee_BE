const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./modules/auth/auth.module"))
app.use("/api/admin", require("./modules/admin/admin.module"));
app.use("/api/seller", require("./modules/seller/seller.module"))
app.use("/api/user", require("./modules/user/user.module"))
app.get("/", (req, res) => {
  res.send("Real Coffee API running");
});

module.exports = app;
