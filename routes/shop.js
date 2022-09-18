const express = require("express");
const router = express.Router();

const isAuthMiddleware = require("../middleware/is-auth");

const shopController = require("../controllers/shop");
router.get("/", shopController.getIndex);

router.get("/cart", isAuthMiddleware, shopController.getCart);

router.post("/add-to-cart", isAuthMiddleware, shopController.postAddToCart);

router.post(
  "/cart-delete-item",
  isAuthMiddleware,
  shopController.postDeleteCartItem
);

router.get("/products", shopController.getProductsList);

router.get("/products/:productId", shopController.getProudct);

router.get("/orders", isAuthMiddleware, shopController.getOrders);

router.get("/orders/:orderId", isAuthMiddleware, shopController.getInvoice);

router.post("/create-order", isAuthMiddleware, shopController.postAddOrder);

module.exports = router;
