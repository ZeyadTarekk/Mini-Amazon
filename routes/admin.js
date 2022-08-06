const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");

// admin/add-product
router.get("/add-product", productsController.getAddProduct);

// admin/product
router.post("/product", productsController.postAddProduct);

module.exports = router;
