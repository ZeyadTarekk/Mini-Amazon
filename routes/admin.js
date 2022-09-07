const express = require("express");
const router = express.Router();

const isAuthMiddleware = require("../middleware/is-auth");

const adminController = require("../controllers/admin");

// admin/add-product
router.get("/add-product", isAuthMiddleware, adminController.getAddProduct);

// admin/product
router.post("/add-product", isAuthMiddleware, adminController.postAddProduct);

router.post("/edit-product", isAuthMiddleware, adminController.postEditProduct);

router.post(
  "/delete-product",
  isAuthMiddleware,
  adminController.postDeleteProduct
);

router.get("/products", isAuthMiddleware, adminController.getAdminProducts);

router.get(
  "/edit-product/:prodId",
  isAuthMiddleware,
  adminController.getEditProduct
);
module.exports = router;
