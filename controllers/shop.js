const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    pageTitle: "Shop",
    path: "/",
  });
};


exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
  });
};

exports.getProductsList = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      pageTitle: "Products",
      prods: products,
      path: "/products",
    });
  });
};
