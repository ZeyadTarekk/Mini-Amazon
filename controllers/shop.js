const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getIndex = async (req, res, next) => {
  const products = await Product.fetchAll();
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
  const productPrice = req.body.prodPrice;
  const userCart = await req.user.getCart();
  const products = await userCart.getProducts({
    where: { id: productId },
  });
  const productToRemove = products[0];
  await productToRemove.cartItem.destroy();
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
  const userOrders = await req.user.getOrders({ include: ["products"] });
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
    orders: userOrders,
  });
};

exports.postAddOrder = async (req, res, next) => {
  const userCart = await req.user.getCart();
  const products = await userCart.getProducts();
  const order = await req.user.createOrder();
  await order.addProducts(
    products.map((prod) => {
      prod.orderItem = { quantity: prod.cartItem.quantity };
      return prod;
    })
  );
  await userCart.setProducts(null);
  res.redirect("/orders");
};
