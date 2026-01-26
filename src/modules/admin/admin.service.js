const User = require("../../models/auth");
const Brand = require("../../models/brand");
const bcrypt = require("bcryptjs");

exports.getUsers = async () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};

exports.createUser = async ({ email, password, role }) => {
  if (!email || !password || !role) {
    throw new Error("Missing required fields");
  }

  if (!["user", "admin"].includes(role)) {
    throw new Error("Admin can only create user or admin");
  }

  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
    role,
  });

  return {
    id: user._id,
    email: user.email,
    role: user.role,
  };
};

exports.updateUser = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // ❌ KHÔNG ĐỔI ROLE SANG SELLER
  if (data.role && data.role === "seller") {
    throw new Error("Cannot assign seller role manually");
  }

  if (data.email !== undefined) user.email = data.email;

  if (data.password) {
    user.password = await bcrypt.hash(data.password, 10);
  }

  if (data.role && ["user", "admin"].includes(data.role)) {
    user.role = data.role;
  }

  await user.save();

  return {
    id: user._id,
    email: user.email,
    role: user.role,
  };
};

exports.deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  await user.deleteOne();
};

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
  brand.rejectedAt = new Date();

  await brand.save();

  console.log(
    "[ADMIN] Brand rejected | brandId:",
    brand._id,
    "| sellerId:",
    brand.ownerId
  );

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
