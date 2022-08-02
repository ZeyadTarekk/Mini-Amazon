const express = require("express");
const router = express.Router();

const path = require("path");
const rootDir = require("../util/path");
const adminExports = require("./admin");

router.get("/", (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  const products = adminExports.products;
  res.render("shop", { prods: products, docTitle: "Shop" });
});

module.exports = router;
