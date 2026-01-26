const User = require("../../models/auth");
const Brand = require("../../models/brand");

exports.getPendingBrands = async () => {
  return Brand.find({ status: "pending" })
    .populate("ownerId", "email role")
    .sort({ createdAt: -1 });
};

exports.approveBrand = async (brandId) => {
  const brand = await Brand.findById(brandId);
  if (!brand) throw new Error("Brand not found");

  if (brand.status !== "pending") {
    throw new Error("Brand already processed");
  }

  brand.status = "approved";
  brand.rejectReason = null;
  await brand.save();

  return brand;
};

exports.rejectBrand = async (brandId, reason) => {
  const brand = await Brand.findById(brandId);
  if (!brand) throw new Error("Brand not found");

  if (brand.status !== "pending") {
    throw new Error("Brand already processed");
  }

  brand.status = "rejected";
  brand.rejectReason = reason || "No reason provided";
  await brand.save();

  return brand;
};

exports.getApprovedBrands = async () => {
  return Brand.find({ status: "approved" })
    .populate("ownerId", "email role")
    .sort({ createdAt: -1 });
};

exports.updateBrand = async (brandId, data) => {
  const brand = await Brand.findById(brandId);
  if (!brand) throw new Error("Brand not found");

  Object.assign(brand, data);
  await brand.save();

  return brand;
};

exports.deleteBrand = async (brandId) => {
  const brand = await Brand.findById(brandId);
  if (!brand) throw new Error("Brand not found");

  await brand.deleteOne();
};
