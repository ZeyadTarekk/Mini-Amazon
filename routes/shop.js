const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");

router.get("/", productsController.getProductsList);

module.exports = router;
