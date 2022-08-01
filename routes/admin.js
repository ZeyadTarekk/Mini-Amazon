const express = require("express");
const router = express.Router();

// admin/add-product
router.get("/add-product", (req, res, next) => {
  res.send(`
    <form action="/admin/product" method="POST">
      <input type="text" name="product" />
      <button type="submit">Submit</button>
    </form>`);
  res.end();
});

// admin/product
router.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
