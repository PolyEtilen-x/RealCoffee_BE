const Brand = require("../models/brand");

exports.checkBrandApproved = async (req, res, next) => {
  if (req.user.role !== "seller") {
    return next();
  }

  console.log(
    "[BRAND CHECK] Start | sellerId:",
    req.user.id
  );

  const brand = await Brand.findOne({ ownerId: req.user.id });

  if (!brand) {
    console.log(
      "[BRAND CHECK] No brand found | sellerId:",
      req.user.id
    );
    return res.status(403).json({
      success: false,
      message: "Seller has not registered a brand",
    });
  }

  if (brand.status === "pending") {
    console.log(
      "[BRAND CHECK] Brand pending | brandId:",
      brand._id
    );
    return res.status(403).json({
      success: false,
      message: "Brand is pending approval",
    });
  }

  if (brand.status === "rejected") {
    console.log(
      "[BRAND CHECK] Brand rejected | brandId:",
      brand._id
    );
    return res.status(403).json({
      success: false,
      message: "Brand was rejected",
      reason: brand.rejectReason,
    });
  }

  console.log(
    "[BRAND CHECK] Brand approved | brandId:",
    brand._id
  );

  next();
};
