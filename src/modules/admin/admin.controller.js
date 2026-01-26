const adminService = require("./admin.service");

//users management
exports.getUsers = async (req, res) => {
  try {
    const users = await adminService.getUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await adminService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await adminService.updateUser(
      req.params.id,
      req.body
    );
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await adminService.deleteUser(req.params.id);
    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//brand management
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

exports.getApprovedBrands = async (req, res) => {
  try {
    console.log('GET APPROVED BRANDS HIT'); 

    const brands = await adminService.getApprovedBrands();
    res.json(brands);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const data = req.body;

    const brand = await adminService.updateBrand(brandId, data);

    res.json({
      success: true,
      data: brand,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    await adminService.deleteBrand(brandId);

    res.json({
      success: true,
      message: "Brand deleted",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};