const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");
const homeController = require("../controllers/home");
router.get("/", homeController.getHomePage);
router.get("/cart", productsController.getCart);
router.get("/products", productsController.getProductsList);
module.exports = router;
