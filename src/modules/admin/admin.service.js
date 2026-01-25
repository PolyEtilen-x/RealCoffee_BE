const User = require("../../models/auth");
const Brand = require("../../models/brand");

//get brands in pending
exports.getPendingBrands = async () => {
  return Brand.find({ status: "pending" })
    .populate("ownerId", "email")
    .sort({ createdAt: -1});
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

exports.getApprovedBrands = async () => {
  return Brand.find({ status: "approved" })
    .populate("ownerId", "email")
    .sort({ createdAt: -1 });
};

exports.updateBrand = async (brandId, data) => {
  const brand = await Brand.findById(brandId);
  if (!brand) throw new Error("Brand not found");

  if (data.name !== undefined) brand.name = data.name;
  if (data.logo !== undefined) brand.logo = data.logo;
  if (data.licenseImage !== undefined)
    brand.licenseImage = data.licenseImage;
  if (data.description !== undefined)
    brand.description = data.description;

  await brand.save();
  return brand;
};

exports.deleteBrand = async (brandId) => {
  const brand = await Brand.findById(brandId);
  if (!brand) throw new Error("Brand not found");

  await User.updateOne(
    { _id: brand.ownerId },
    { $unset: { brandId: "" } }
  );

  await brand.deleteOne();
};

