const express = require("express");
const router = express.Router();
const controller = require("./user.controller");
const { checkAuth } = require("../../middleware/auth.middleware");

router.get("/brands", controller.getBrands);
router.get("/products/:brandId", controller.getProductsByBrand);

//check login if order
router.use(checkAuth);

router.post("/orders", controller.createOrder);
router.get("/orders/my", controller.getMyOrders);

module.exports = router;
