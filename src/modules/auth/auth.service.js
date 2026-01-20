const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/auth");
const RefreshToken = require("../../models/refreshToken");
const Brand = require("../../models/brand");

//handle to create and refesh token
const createAccessToken = (user) =>
  jwt.sign(
    { id: user._id, 
      role: user.role, 
      brandId: user.brandId ? user.brandId._id : null,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const createRefreshToken = (user) =>
  jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );


exports.register = async ({ email, password }) => {
  console.log(
    `[REGISTER] Request received | email=${email} | time=${new Date().toISOString()}`
  );

  const exists = await User.findOne({ email });
  if (exists) {
    console.log(`[REGISTER] FAILED - Email already exists: ${email}`);
    throw new Error("Email already exists");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
    role: "user",
    status: "approved",
  });

  return user;
};

exports.registerSeller = async ({
  email,
  password,
  brand,
  logoUrl,
  licenseUrl,
}) => {
  // check email
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already exists");

  if (!brand || !brand.name) {
    throw new Error("Brand information is required");
  }

  const hashed = await bcrypt.hash(password, 10);

  // create seller account
  const user = await User.create({
    email,
    password: hashed,
    role: "seller",
    status: "pending",
  });

  // create brand (LUÔN tạo mới)
  const newBrand = await Brand.create({
    name: brand.name,
    description: brand.description,
    phone: brand.phone,
    address: brand.address,
    taxCode: brand.taxCode,

    logo: logoUrl,                
    licenseImage: licenseUrl,     

    ownerId: user._id,
    status: "pending",
    isMainBrand: false,
  });

  // link seller ↔ brand
  user.brandId = newBrand._id;
  await user.save();

  return {
    userId: user._id,
    brandId: newBrand._id,
  };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).populate("brandId");
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Wrong password");

  if (user.role === "seller" && user.status !== "approved") {
    throw new Error("Seller not approved yet");
  }

  console.log(
    `[LOGIN] SUCCESS | id=${user._id} | email=${user.email} | role=${user.role}`
  );

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      brandId: user.brandId ? user.brandId._id : null
    },
  };
};
