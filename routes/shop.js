const express = require("express");
const router = express.Router();

const path = require("path");
const rootDir = require("../util/path");

router.get("/", (req, res, next) => {
  console.log("Giving back");
  res.sendFile(path.join(rootDir, "views", "shop.html"));
  // res.end();
  console.log("Giving back done");
});

module.exports = router;
