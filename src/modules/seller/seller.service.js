const Product = require("../../models/product");
const Order = require("../../models/order");

exports.createProduct = async (seller, data) => {
  if (!seller.brandId) throw new Error("Seller has no brand");

  return Product.create({
    ...data,
    brandId: seller.brandId,
  });
};

exports.getMyProducts = async (seller) => {
  return Product.find({ brandId: seller.brandId });
};

exports.getBrandOrders = async (seller) => {
  return Order.find({ brandId: seller.brandId });
};

exports.approveOrder = async (seller, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    brandId: seller.brandId,
  });

  if (!order) throw new Error("Order not found");

  order.status = "approved";
  return order.save();
};
