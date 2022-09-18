const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = async (req, res, next) => {
  const products = await Product.find();
  res.render("shop/index", {
    pageTitle: "Shop",
    prods: products,
    path: "/",
  });
};

exports.getCart = async (req, res, next) => {
  const userPopulated = await req.user.populate("cart.items.productId");
  const cartItems = userPopulated.cart.items;
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    productsData: cartItems,
  });
};

exports.postDeleteCartItem = async (req, res, next) => {
  const productId = req.body.productId;
  await req.user.removeFromCart(productId);
  res.redirect("/cart");
};

exports.postAddToCart = async (req, res, next) => {
  const prodId = req.body.productId;
  const product = await Product.findById(prodId);
  req.user.addToCart(product);
  res.redirect("/cart");
};

exports.getProductsList = async (req, res, next) => {
  const results = await Product.find();
  res.render("shop/product-list", {
    pageTitle: "Products",
    prods: results,
    path: "/products",
  });
};

exports.getProudct = async (req, res, next) => {
  const prodId = req.params.productId;

  const result = await Product.findById(prodId);
  res.render("shop/product-detail", {
    pageTitle: result.title,
    product: result,
    path: "/products",
  });
};

exports.getOrders = async (req, res, next) => {
  const userOrders = await Order.find({ "user.userId": req.user._id });
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
    orders: userOrders,
  });
};

exports.postAddOrder = async (req, res, next) => {
  const userPopulated = await req.user.populate("cart.items.productId");

  const cartItems = userPopulated.cart.items.map((el) => {
    return { quantity: el.quantity, product: { ...el.productId._doc } };
  });

  const order = new Order({
    user: {
      userId: req.user._id,
      email: req.user.email,
    },
    products: cartItems,
  });
  await order.save();
  await req.user.clearCart();

  res.redirect("/orders");
};
