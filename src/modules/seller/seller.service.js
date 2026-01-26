const Product = require("../../models/product");
const Order = require("../../models/order");
const Brand = require("../../models/brand");

exports.createProduct = async (sellerId, data) => {
  const brand = await Brand.findOne({ ownerId: sellerId });

  if (!brand) {
    throw new Error("Brand not found");
  }

  return Product.create({
    ...data,
    brandId: brand._id,
  });
};

exports.getMyProducts = async (sellerId) => {
  const brand = await Brand.findOne({ ownerId: sellerId });
  if (!brand) return [];

  return Product.find({ brandId: brand._id });
};

exports.getBrandOrders = async (sellerId) => {
  const brand = await Brand.findOne({ ownerId: sellerId });
  if (!brand) return [];

  return Order.find({ brandId: brand._id });
};

exports.approveOrder = async (sellerId, orderId) => {
  const brand = await Brand.findOne({ ownerId: sellerId });
  if (!brand) throw new Error("Brand not found");

  const order = await Order.findOne({
    _id: orderId,
    brandId: brand._id,
  });

  if (!order) throw new Error("Order not found");

  order.status = "approved";
  return order.save();
};