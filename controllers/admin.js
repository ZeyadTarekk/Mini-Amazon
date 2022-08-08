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
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.desc;
  const photo = req.body.photo;
  const product = new Product(title, price, description, photo);
  product.save();
  res.redirect("/products");
};
