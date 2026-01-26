const express = require("express");
const router = express.Router();
const controller = require("./admin.controller");

const {
  authenticate,
  authorize,
} = require("../../middleware/auth.middleware");

//check login 
router.use(authenticate);
router.use(authorize("admin"));

router.get("/brands/approved", controller.getApprovedBrands);

router.get("/brands/pending", controller.getPendingBrands);
router.patch("/brands/:brandId/approve", controller.approveBrand);
router.patch("/brands/:brandId/reject", controller.rejectBrand);

router.patch("/brands/:brandId", controller.updateBrand);
router.delete("/brands/:brandId", controller.deleteBrand);


module.exports = router;
