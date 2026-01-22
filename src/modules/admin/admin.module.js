const express = require("express");
const router = express.Router();
const controller = require("./admin.controller");
const {
  checkAuth,
  checkRole,
} = require("../../middleware/auth.middleware");

//check login 
router.use(checkAuth);
router.use(checkRole("admin"));

router.patch("/brands/pending", controller.getPendingBrands);
router.patch("/brands/:brandId/approve", controller.approveBrand);
router.patch("/brands/:brandId/reject", controller.rejectBrand);

module.exports = router;
