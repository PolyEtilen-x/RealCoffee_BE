const adminService = require("./admin.service");

exports.getPendingSellers = async (req, res) => {
  try {
    const sellers = await adminService.getPendingSellers();
    res.json(sellers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.approveBrand = async (req, res) => {
  try {
    const result = await adminService.approveBrand(req.params.brandId);
    res.json({
      message: "Brand approved",
      data: result,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.rejectBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const { reason } = req.body; 

    const result = await adminService.rejectBrand(brandId, reason);

    res.json({
      success: true,
      message: "Brand rejected",
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
