const adminService = require("./admin.service");

exports.getPendingSellers = async (req, res) => {
  try {
    const sellers = await adminService.getPendingSellers();
    res.json(sellers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.approveSeller = async (req, res) => {
  try {
    const seller = await adminService.approveSeller(req.params.id);
    res.json({ message: "Seller approved", seller });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const brand = await adminService.createBrand(req.body);
    res.json({ message: "Brand created", brand });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
