const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/auth");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await User.findOne({ role: "admin" });
  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await User.create({
    email: "admin@realcoffee.com",
    password: hashedPassword,
    role: "admin",
    status: "approved",
  });

  console.log("Admin account created");
  process.exit();
}

createAdmin();
