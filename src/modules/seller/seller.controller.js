const sellerService = require("./seller.service");

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
