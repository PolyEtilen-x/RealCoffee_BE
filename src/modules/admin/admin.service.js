const User = require("../../models/auth");
const Brand = require("../../models/brand");

//get user in pending
exports.getPendingSellers = async () => {
  return User.find({ role: "seller", status: "pending" }).select("-password");
};

//accept register for seller
exports.approveSeller = async (sellerId) => {
  const seller = await User.findById(sellerId);
  if (!seller || seller.role !== "seller") {
    throw new Error("Seller not found");
  }

  seller.status = "approved";
  await seller.save();
  return seller;
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
