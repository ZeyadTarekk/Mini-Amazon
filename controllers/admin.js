const Product = require("../models/product");

exports.getAdminProducts = (req, res, next) => {
  res.render("admin/products.ejs", {
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/products");
};
