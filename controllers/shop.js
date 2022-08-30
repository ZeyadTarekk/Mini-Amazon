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

exports.postAddToCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const userCart = await req.user.getCart();
  const products = await userCart.getProducts({ where: { id: prodId } });
  let product;
  if (products.length > 0) product = products[0];
  let newQuantity = 1;
  if (product) {
    // Increase qty
    const oldQuantity = product.cartItem.quantity;
    newQuantity = oldQuantity + 1;
  }
  const actualProduct = await Product.findByPk(prodId);
  await userCart.addProduct(actualProduct, {
    through: { quantity: newQuantity },
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
