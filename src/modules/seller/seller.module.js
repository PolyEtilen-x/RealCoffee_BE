const express = require("express");
const router = express.Router();
const controller = require("./seller.controller");
const {
  checkAuth,
  checkRole,
} = require("../../middleware/auth.middleware");

router.use(checkAuth);
router.use(checkRole("seller"));

router.post("/products", controller.createProduct);
router.get("/products", controller.getMyProducts);

router.get("/orders", controller.getOrders);
router.patch("/orders/:id/approve", controller.approveOrder);

module.exports = router;
