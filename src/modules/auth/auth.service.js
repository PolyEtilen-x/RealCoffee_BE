const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/auth");

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


exports.register = async ({ email, password, role }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
    role,
    status: role === "seller" ? "pending" : "approved",
  });

  return user;
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error("User not found"), { code: "USER_NOT_FOUND" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Object.assign(new Error("Wrong password"), { code: "WRONG_PASSWORD" });

  if (user.role === "seller" && user.status !== "approved") {
    throw Object.assign(new Error("Seller not approved yet"), { code: "SELLER_PENDING" });
  }

  return  {
    accessToken: createAccessToken(user),
    refeshToken: createRefreshToken(user),
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    }
  }
};
