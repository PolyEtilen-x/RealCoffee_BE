const jwt = require("jsonwebtoken");
const RefreshToken = require("../../models/refreshToken");
const authService = require("./auth.service");
const {uploadBuffer} = require("../../utils/cloudinaryUpload");
const upload = require("../../middleware/upload.middleware");

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.json({
      success: true,
      message: "Register success",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.registerSeller = async (req, res) => {
  try {
    console.log("[REGISTER SELLER CONTROLLER] Body:", {
      email: req.body.email,
      brand: req.body.brand?.name,
    });

    let logoUrl = null;
    let licenseUrl = null;

    if (req.files?.logo?.[0]) {
      logoUrl = await uploadBuffer(
        req.files.logo[0].buffer,
        "realcoffee/brands/logo"
      );
    }

    if (req.files?.licenseImage?.[0]) {
      licenseUrl = await uploadBuffer(
        req.files.licenseImage[0].buffer,
        "realcoffee/brands/license"
      );
    }

    const result = await authService.registerSeller({
      ...req.body,
      logoUrl,
      licenseUrl,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Register seller success. Waiting for admin approval",
      data: {
        accessToken: result.accessToken,
        user: result.user,
        brand: result.brand,
      },
    });
  } catch (err) {
    console.error("[REGISTER SELLER ERROR]", err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


exports.login = async (req, res) => {
  try {
    console.log("[LOGIN CONTROLLER] Request body:", {
      email: req.body.email,
    });

    const result = await authService.login(req.body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',   
      secure: false,     
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log(
      "[LOGIN CONTROLLER] Success | userId:",
      result.user.id,
      "| role:",
      result.user.role
    );

    res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (err) {
    console.error("[LOGIN CONTROLLER] Error:", err.message);
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};


exports.refreshToken = async (req, res) => {
  try {
    const tokenFromCookie = req.cookies.refreshToken;
    if (!tokenFromCookie) {
      throw new Error("No refresh token");
    }

    const stored = await RefreshToken.findOne({
      token: tokenFromCookie,
    });

    if (!stored) {
      throw new Error("Refresh token revoked");
    }

    const user = await User.findById(stored.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message || "Invalid refresh token",
    });
  }
};

exports.logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await RefreshToken.deleteOne({ token });
  }

  res.clearCookie("refreshToken");

  res.json({
    success: true,
    message: "Logged out",
  });
};
