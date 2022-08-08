const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");
const adminController = require("../controllers/admin");

// admin/add-product
router.get("/add-product", productsController.getAddProduct);

// admin/product
router.post("/add-product", productsController.postAddProduct);

router.get("/products", adminController.getAdminProducts);

module.exports = router;
