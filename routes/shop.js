const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");
router.get("/", shopController.getIndex);

router.get("/cart", shopController.getCart);

router.get("/products", shopController.getProductsList);

module.exports = router;
