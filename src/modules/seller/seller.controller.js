const sellerService = require("./seller.service");
const Brand = require("../../models/brand");

exports.getBrandStatus = async (req, res) => {
  const userId = req.user.id;

  console.log("[SELLER] Get brand status | sellerId:", userId);

  const brand = await Brand.findOne({ ownerId: userId });

  if (!brand) {
    return res.json({ status: "none" });
  }

  return res.json({
    status: brand.status,
    brand,
    reason: brand.rejectReason || null,
  });
};

exports.createProduct = async (req, res) => {
  try {
    console.log("[SELLER] Create product | sellerId:", req.user.id);

    const product = await sellerService.createProduct(
      req.user.id,
      req.body
    );

    res.json(product);
  } catch (err) {
    console.error("[SELLER] Create product error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.getMyProducts = async (req, res) => {
  console.log("[SELLER] Get my products | sellerId:", req.user.id);
  const products = await sellerService.getMyProducts(req.user.id);
  res.json(products);
};

exports.getOrders = async (req, res) => {
  console.log("[SELLER] Get orders | sellerId:", req.user.id);
  const orders = await sellerService.getBrandOrders(req.user.id);
  res.json(orders);
};

exports.approveOrder = async (req, res) => {
  try {
    console.log(
      "[SELLER] Approve order | sellerId:",
      req.user.id,
      "| orderId:",
      req.params.id
    );

    const order = await sellerService.approveOrder(
      req.user.id,
      req.params.id
    );

    res.json(order);
  } catch (err) {
    console.error("[SELLER] Approve order error:", err.message);
    res.status(400).json({ message: err.message });
  }
};
