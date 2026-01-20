const User = require("../../models/auth");
const Brand = require("../../models/brand");

//get user in pending
exports.getPendingSellers = async () => {
  return User.find({ role: "seller", status: "pending" })
    .select("-password")
    .populate("brandId");
};

//check new brand
exports.approveBrand = async (brandId) => {
  const brand = await Brand.findById(brandId);
  if (!brand) throw new Error("Brand not found");

  if (brand.status !== "pending") {
    throw new Error("Brand already processed");
  }

  brand.status = "approved";
  await brand.save();

  // approve seller
  const seller = await User.findById(brand.ownerId);
  if (!seller) throw new Error("Seller not found");

  seller.status = "approved";
  await seller.save();

  return {
    brand,
    seller,
  };
};



//create brand
exports.createBrand = async ({ name, description, ownerId, isMainBrand }) => {
  const seller = await User.findById(ownerId);
  if (!seller || seller.role !== "seller") {
    throw new Error("Invalid seller");
  }

  const brand = await Brand.create({
    name,
    description,
    ownerId,
    isMainBrand: !!isMainBrand,
  });

  seller.brandId = brand._id;
  await seller.save();

  return brand;
};

exports.rejectBrand = async (brandId, reason) => {
  const brand = await Brand.findById(brandId);
  if (!brand) throw new Error("Brand not found");

  if (brand.status !== "pending") {
    throw new Error("Brand already processed");
  }

  brand.status = "rejected";
  if (reason) {
    brand.rejectReason = reason;
  }
  await brand.save();

  const seller = await User.findById(brand.ownerId);
  if (!seller) throw new Error("Seller not found");

  seller.status = "rejected";
  await seller.save();

  return {
    brand,
    seller,
  };
};
