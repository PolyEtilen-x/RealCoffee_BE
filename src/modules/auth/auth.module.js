const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");
const upload = require("../../middleware/upload.middleware");

router.post("/register", controller.register);
router.post(
    "/register-seller", 
    upload.fields([
        { name: "logo" , maxCount: 1},
        { name: "licenseImage" , maxCount: 1}
    ]),
    controller.registerSeller
);


router.post("/login", controller.login);
router.post("/refresh", controller.refreshToken);
router.post("/logout", controller.logout);

module.exports = router;
