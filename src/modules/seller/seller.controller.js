const sellerService = require("./seller.service");
const Brand = require("../../models/brand");

exports.getBrandStatus = async (req, res) => {
  const userId = req.user.id;

  const brand = await Brand.findOne({ ownerId: userId });

  if (!brand) {
    return res.json({ status: 'none' });
  }

  if (brand.status === 'pending') {
    return res.json({ status: 'pending', brand });
  }

  if (brand.status === 'rejected') {
    return res.json({
      status: 'rejected',
      brand,
      reason: brand.rejectReason || 'Không có lý do'
    });
  }

  if (brand.status === 'approved') {
    return res.json({ status: 'approved', brand });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await sellerService.createProduct(req.user, req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyProducts = async (req, res) => {
  const products = await sellerService.getMyProducts(req.user);
  res.json(products);
};

exports.getOrders = async (req, res) => {
  const orders = await sellerService.getBrandOrders(req.user);
  res.json(orders);
};

exports.approveOrder = async (req, res) => {
  try {
    const order = await sellerService.approveOrder(
      req.user,
      req.params.id
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

