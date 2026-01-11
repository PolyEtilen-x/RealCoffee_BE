const userService = require("./user.service");

exports.getBrands = async (req, res) => {
  const brands = await userService.getBrands();
  res.json(brands);
};

exports.getProductsByBrand = async (req, res) => {
  const products = await userService.getProductsByBrand(req.params.brandId);
  res.json(products);
};

exports.createOrder = async (req, res) => {
  try {
    const order = await userService.createOrder(req.user, req.body.items);
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await userService.getMyOrders(req.user.id);
  res.json(orders);
};
