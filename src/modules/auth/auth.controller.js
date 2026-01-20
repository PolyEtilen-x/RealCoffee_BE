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

    res.json({
      success: true,
      message: "Register seller success. Waiting for admin approval",
      data: result,
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
    console.log('[LOGIN BODY]', req.body); 

    const result = await authService.login(req.body);

    console.log('[LOGIN SUCCESS]', result.user.email); 
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err.message); 
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new Error("No refresh token");

    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored) throw new Error("Refresh token revoked");

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id },
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
  const { refreshToken } = req.body;

  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  res.json({
    success: true,
    message: "Logged out",
  });
};
