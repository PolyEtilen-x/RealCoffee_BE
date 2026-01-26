const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../../models/auth");
const RefreshToken = require("../../models/refreshToken");
const Brand = require("../../models/brand");

function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

//handle to create token
function createAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

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
  console.log("[REGISTER SELLER] Start | email:", email);

  // check exist
  if (!email || !password || !brand?.name) {
    console.log("[REGISTER SELLER] Missing required data");
    throw new Error("Invalid register seller data");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("[REGISTER SELLER] Email already exists:", email);
    throw new Error("Email already exists");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. create seller account
    const hashed = await bcrypt.hash(password, 10);

    const seller = await User.create(
      [
        {
          email,
          password: hashed,
          role: "seller",
        },
      ],
      { session }
    );

    console.log("[REGISTER SELLER] Seller created:", seller[0]._id);

    // 2. create brand
    const newBrand = await Brand.create(
      [
        {
          name: brand.name,
          description: brand.description,
          phone: brand.phone,
          address: brand.address,
          taxCode: brand.taxCode,
          logo: logoUrl,
          licenseImage: licenseUrl,
          ownerId: seller[0]._id,
          status: "pending",
        },
      ],
      { session }
    );

    console.log("[REGISTER SELLER] Brand created:", newBrand[0]._id);

    // 3. commit
    await session.commitTransaction();
    session.endSession();

    // 4. issue JWT
    const accessToken = createAccessToken(seller[0]);

    await RefreshToken.deleteOne({ userId: seller[0]._id });

    const refreshToken = generateRefreshToken();

    await RefreshToken.create({
      userId: seller[0]._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });


    console.log("[REGISTER SELLER] Token issued");

    return {
      accessToken,
      refreshToken,
      user: {
        id: seller[0]._id,
        email: seller[0].email,
        role: "seller",
      },
      brand: {
        id: newBrand[0]._id,
        status: "pending",
      },
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("[REGISTER SELLER] Failed:", err.message);
    throw err;
  }
};

exports.login = async ({ email, password }) => {
  console.log("[LOGIN] Start | email:", email);

  if (!email || !password) {
    throw new Error("Invalid email or password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid email or password");
  }

  const accessToken = createAccessToken(user);

  await RefreshToken.deleteOne({ userId: user._id });

  const refreshToken = generateRefreshToken();

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
