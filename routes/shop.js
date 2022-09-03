const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");
router.get("/", shopController.getIndex);

// router.get("/cart", shopController.getCart);

// router.post("/add-to-cart", shopController.postAddToCart);

// router.post("/cart-delete-item", shopController.postDeleteCartItem);

router.get("/products", shopController.getProductsList);

router.get("/products/:productId", shopController.getProudct);

// router.get("/orders", shopController.getOrders);

// router.post("/create-order", shopController.postAddOrder);

module.exports = router;
