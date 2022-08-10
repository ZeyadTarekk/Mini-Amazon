const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");
router.get("/", shopController.getIndex);

router.get("/cart", shopController.getCart);

router.get("/products", shopController.getProductsList);

router.get("/products/:productId", shopController.getProudct);

router.get("/orders", shopController.getOrders);

module.exports = router;
