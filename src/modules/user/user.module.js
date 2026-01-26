const express = require("express");
const router = express.Router();
const controller = require("./user.controller");

const {
  authenticate,
} = require("../../middleware/auth.middleware");

router.get("/brands", controller.getBrands);
router.get("/products/:brandId", controller.getProductsByBrand);

router.use(authenticate);

router.post("/orders", controller.createOrder);
router.get("/orders/my", controller.getMyOrders);

module.exports = router;
