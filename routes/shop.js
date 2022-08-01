const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("<h1>Hello from general  middleware</h1>");
  res.end();
});

module.exports = router;
