const authService = require("./auth.service");

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.json({ message: "Register success", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json({
      succes: true,
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      succes: false,
      message: err.message,
      errorCode: err.code || null
    });
  }
};

exports.refeshToken = (req, res) => {
  try {
    const {refeshToken} = res.body;
    
    if (!refeshToken) throw new Error("No refresh token");

    const decoded = jwt.verify(
      refeshToken,
      ProcessingInstruction.env.JWT_REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      {id: decoded.id},
      process.env.JWT_SECRET,
      {expiresIn: "15m"}
    );

    res.json({
      success: true,
      data: {accessToken: newAccessToken}
    });
  } catch {
    res.status(401).json({
      succes: false,
      message: "Invalid refresh token"
    });
  }
};
