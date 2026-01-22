const adminService = require("./admin.service");

exports.getPendingBrands = async (req, res) => {
  try {
    const brands = await adminService.getPendingBrands();
    res.json({
      success: true,
      data: brands,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.approveBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const result = await adminService.approveBrand(req.params.brandId);
    
    res.json({
      success: true,
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
    res.status(400).json({ message: err.message });
  }
};
