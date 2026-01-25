const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/auth");
const RefreshToken = require("../../models/refreshToken");
const Brand = require("../../models/brand");

//handle to create and refesh token
const createAccessToken = (user) =>
  jwt.sign(
    { 
      id: user._id, 
      role: user.role
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
  console.log("[REGISTER USER] Start | email:", email);

  if (!email || !password) {
    console.log("[REGISTER USER] Missing email or password");
    throw new Error("Email and password are required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("[REGISTER USER] Email already exists:", email);
    throw new Error("Email already exists");
  }

  const hashed = await bcrypt.hash(password, 10);
  console.log("[REGISTER USER] Password hashed");

  const user = await User.create({
    email,
    password: hashed,
    role: "user",
  });

  console.log("[REGISTER USER] Success | userId:", user._id);

  return {
    id: user._id,
    email: user.email,
    role: user.role,
  };
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

  // create brand 
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

  user.brandId = newBrand._id;
  await user.save();

  return {
    userId: user._id,
    brandId: newBrand._id,
  };
};

exports.login = async ({ email, password }) => {
  console.log("[LOGIN] Start | email:", email);

  if (!email || !password) {
    console.log("[LOGIN] Missing credentials");
    throw new Error("Invalid email or password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log("[LOGIN] User not found:", email);
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log("[LOGIN] Wrong password | userId:", user._id);
    throw new Error("Invalid email or password");
  }

  console.log(
    "[LOGIN] Credentials valid | userId:",
    user._id,
    "| role:",
    user.role
  );

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = createRefreshToken(user);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  console.log("[LOGIN] Token issued | userId:", user._id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};
