const express = require("express");
const router = express.Router();
const path = require("path");

const rootDir = require("../util/path");

const products = [];

// admin/add-product
router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

// admin/product
router.post("/product", (req, res, next) => {
  products.push({ title: req.body.title });
  console.log(products);
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
