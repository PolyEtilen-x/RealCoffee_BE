const express = require("express");
const cors = require("cors");
const allowedOrigins = ['http://localhost:4200'];

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", require("./modules/auth/auth.module"))
app.use("/api/admin", require("./modules/admin/admin.module"));
app.use("/api/seller", require("./modules/seller/seller.module"))
app.use("/api/user", require("./modules/user/user.module"))
app.get("/", (req, res) => {
  res.send("Real Coffee API running");
});
require("./jobs/cleanupRejectedSellers.job");


module.exports = app;
