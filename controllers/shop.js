const Product = require("../models/product");

exports.getIndex = async (req, res, next) => {
  const products = await Product.find();
  res.render("shop/index", {
    pageTitle: "Shop",
    prods: products,
    path: "/",
  });
};

exports.getCart = async (req, res, next) => {
  const cartProducts = await req.user.getCart();
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    productsData: cartProducts,
  });
};

exports.postDeleteCartItem = async (req, res, next) => {
  const productId = req.body.productId;
  await req.user.deleteCartItem(productId);
  res.redirect("/cart");
};

exports.postAddToCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const product = await Product.findById(prodId);
  req.user.addToCart(product);
  res.redirect("/cart");
};

exports.getProductsList = async (req, res, next) => {
  const results = await Product.fetchAll();
  res.render("shop/product-list", {
    pageTitle: "Products",
    prods: results,
    path: "/products",
  });
};

exports.getProudct = async (req, res, next) => {
  const prodId = req.params.productId;

  const results = await Product.findById(prodId);
  res.render("shop/product-detail", {
    pageTitle: results.title,
    product: results,
    path: "/products",
  });
};

exports.getOrders = async (req, res, next) => {
  const userOrders = await req.user.getOrders();
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
    orders: userOrders,
  });
};

exports.postAddOrder = async (req, res, next) => {
  await req.user.addOrder();
  res.redirect("/orders");
};
