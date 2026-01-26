const Brand = require("../../models/brand");
const Product = require("../../models/product");
const Order = require("../../models/order");

exports.getBrands = async () => {
  return Brand.find({ status: "approved" });
};

exports.getProductsByBrand = async (brandId) => {
  return Product.find({ brandId });
};

exports.createOrder = async (user, items) => {
  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  //get product
  const productIds = items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== items.length) {
    throw new Error("Invalid product in cart");
  }

  let total = 0;
  let brandId = products[0].brandId;

  const orderItems = items.map(item => {
    const product = products.find(
      p => p._id.toString() === item.productId
    );

    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

    total += product.price * item.quantity;

    return {
      productId: product._id,
      quantity: item.quantity,
      price: product.price,
    };
  });

  // create order
  const order = await Order.create({
    userId: user.id,
    brandId,
    items: orderItems,
    totalAmount: total,
    status: "pending",
  });

  return order;
};

exports.getMyOrders = async (userId) => {
  return Order.find({ userId });
};
