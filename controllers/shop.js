const Product = require("../models/product");
const Cart = require("../models/cart");
exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      pageTitle: "Shop",
      prods: products,
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const p = cart.products.find((element) => element.id == product.id);
        if (p) cartProducts.push({ product: product, qty: p.qty });
      }
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        productsData: cartProducts,
      });
    });
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

exports.getProductsList = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      pageTitle: "Products",
      prods: products,
      path: "/products",
    });
  });
};

exports.getProudct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.fetchProductById(prodId, (product) => {
    res.render("shop/product-detail", {
      pageTitle: product.title,
      product: product,
      path: "/products",
    });
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};
