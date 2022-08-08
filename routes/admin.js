const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

// admin/add-product
router.get("/add-product", adminController.getAddProduct);

// admin/product
router.post("/add-product", adminController.postAddProduct);

router.get("/products", adminController.getAdminProducts);

module.exports = router;
