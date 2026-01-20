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

router.get("/pending-sellers", controller.getPendingSellers);

router.patch("/approve-brand/:brandId", controller.approveBrand);
router.patch("/reject-brand/:brandId", controller.rejectBrand);

module.exports = router;
