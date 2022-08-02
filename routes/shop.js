const express = require("express");
const router = express.Router();

const path = require("path");
const rootDir = require("../util/path");
const adminExports = require("./admin");

router.get("/", (req, res, next) => {
  console.log(adminExports.products);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
