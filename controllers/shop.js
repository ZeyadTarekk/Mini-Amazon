const Product = require("../models/product");
const Cart = require("../models/cart");
exports.getIndex = async (req, res, next) => {
  const products = await Product.findAll();

  res.render("shop/index", {
    pageTitle: "Shop",
    prods: products,
    path: "/",
  });
};

exports.getCart = async (req, res, next) => {
  const userCart = await req.user.getCart();
  const cartProducts = await userCart.getProducts();

  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    productsData: cartProducts,
  });
};

exports.postDeleteCartItem = (req, res, next) => {
  const productId = req.body.prodId;
  const productPrice = req.body.prodPrice;
  Cart.deleteItem(productId, productPrice);
  res.redirect("/cart");
};

exports.postAddToCart = (req, res, next) => {
  const prodId = req.body.productId;
  // console.log(prodId);
  Product.fetchProductById(prodId, (product) => {
    Cart.addProductToCart(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.getProductsList = async (req, res, next) => {
  const results = await Product.findAll();
  res.render("shop/product-list", {
    pageTitle: "Products",
    prods: results,
    path: "/products",
  });
};

exports.getProudct = async (req, res, next) => {
  const prodId = req.params.productId;

  const results = await Product.findByPk(prodId);
  res.render("shop/product-detail", {
    pageTitle: results.title,
    product: results,
    path: "/products",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};
