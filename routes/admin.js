const express = require("express");
const router = express.Router();
const { body } = require("express-validator/check");

const isAuthMiddleware = require("../middleware/is-auth");

const adminController = require("../controllers/admin");

// admin/add-product
router.get("/add-product", isAuthMiddleware, adminController.getAddProduct);

// admin/product
router.post(
  "/add-product",
  isAuthMiddleware,
  [
    body("title", "Enter a valid title").isString().isLength({ min: 3 }).trim(),
    body("price", "Enter a valid price").isFloat(),
    body("desc", "Enter a valid description")
      .isLength({ min: 5, max: 500 })
      .trim(),
  ],
  adminController.postAddProduct
);

router.post(
  "/edit-product",
  isAuthMiddleware,
  [
    body("title", "Enter a valid title").isString().isLength({ min: 3 }).trim(),
    body("price", "Enter a valid price").isFloat(),
    body("desc", "Enter a valid description")
      .isLength({ min: 5, max: 500 })
      .trim(),
  ],
  adminController.postEditProduct
);

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
