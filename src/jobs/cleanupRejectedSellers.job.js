const cron = require("node-cron");
const Brand = require("../models/brand");
const User = require("../models/auth");
const Product = require("../models/product");
const Order = require("../models/order");

const DAYS_7 = 7 * 24 * 60 * 60 * 1000;

cron.schedule("0 3 * * *", async () => {
  console.log("[JOB] Cleanup rejected sellers started");

  const now = new Date();
  const expiredTime = new Date(now.getTime() - DAYS_7);

  const rejectedBrands = await Brand.find({
    status: "rejected",
    rejectedAt: { $lte: expiredTime },
  });

  for (const brand of rejectedBrands) {
    console.log(
      "[JOB] Deleting rejected brand & seller | brandId:",
      brand._id,
      "| sellerId:",
      brand.ownerId
    );

    await Product.deleteMany({ brandId: brand._id });

    await Order.deleteMany({ brandId: brand._id });

    await User.deleteOne({ _id: brand.ownerId });

    await Brand.deleteOne({ _id: brand._id });
  }

  console.log(
    "[JOB] Cleanup done | total deleted:",
    rejectedBrands.length
  );
});
