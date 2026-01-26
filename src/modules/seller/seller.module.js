const express = require("express");
const router = express.Router();
const controller = require("./seller.controller");

const {
  authenticate,
  authorize,
} = require("../../middleware/auth.middleware");

const {
  checkBrandApproved,
} = require("../../middleware/brand.middleware");

router.use(authenticate);
router.use(authorize("seller"));

router.get("/brand-status", controller.getBrandStatus);

router.post(
  "/products",
  checkBrandApproved,
  controller.createProduct
);

router.get(
  "/products",
  checkBrandApproved,
  controller.getMyProducts
);

router.get(
  "/orders",
  checkBrandApproved,
  controller.getOrders
);

router.patch(
  "/orders/:id/approve",
  checkBrandApproved,
  controller.approveOrder
);

module.exports = router;
