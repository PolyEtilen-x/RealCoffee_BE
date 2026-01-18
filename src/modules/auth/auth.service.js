const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/auth");
const RefreshToken = require("../../models/refreshToken");

//handle to create and refesh token
const createAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
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


exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
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
    },
  };
};
