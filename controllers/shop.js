const fs = require("fs");
const path = require("path");

const stripe = require("stripe")(
  "sk_test_51LjczpLhcmFB7oqy6EQaltVvJr5EZMImn67ohWjhl9QgfQbvykfZzAzoOBXfVG7l9g6dArir0iRwqpstRpQ39ulP00gztaVCAx"
);

const Product = require("../models/product");
const Order = require("../models/order");

const PDFDocument = require("pdfkit");

const ITEMS_PER_PAGE = 2;

exports.getIndex = async (req, res, next) => {
  const page = req.query.page || 1;

  const productsNumber = await Product.find().count();

  const products = await Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  res.render("shop/index", {
    pageTitle: "Shop",
    prods: products,
    path: "/",
    currentPage: parseInt(page),
    hasNextPage: ITEMS_PER_PAGE * page < productsNumber,
    hasPreviousPage: page > 1,
    nextPage: parseInt(page) + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(productsNumber / ITEMS_PER_PAGE),
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
  const page = req.query.page || 1;

  const productsNumber = await Product.find().count();

  const results = await Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  res.render("shop/product-list", {
    pageTitle: "Products",
    prods: results,
    path: "/products",
    currentPage: parseInt(page),
    hasNextPage: ITEMS_PER_PAGE * page < productsNumber,
    hasPreviousPage: page > 1,
    nextPage: parseInt(page) + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(productsNumber / ITEMS_PER_PAGE),
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

exports.getCheckoutSuccess = async (req, res, next) => {
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

exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;

  const neededOrder = await Order.findById(orderId);

  if (!neededOrder) return next(new Error("no order found"));

  if (neededOrder.user.userId.toString() !== req.user._id.toString())
    return next(new Error("Unathorized"));

  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join("data", "invoices", invoiceName);

  const pdfDoc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  pdfDoc.fontSize(26).text("Invoice", { underline: true });
  pdfDoc.text("----------------------------------");

  let totalPrice = 0;

  for (const product of neededOrder.products) {
    totalPrice += product.quantity * product.product.price;
    pdfDoc
      .fontSize(14)
      .text(
        `${product.product.title} - ${product.quantity}x$${product.product.price}`
      );
  }
  pdfDoc.fontSize(26).text("----------------------------------");

  pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);

  pdfDoc.end();
};

exports.getCheckout = async (req, res, next) => {
  const userPopulated = await req.user.populate("cart.items.productId");

  const products = userPopulated.cart.items;
  let totalSum = 0;
  for (const prod of products) {
    totalSum += prod.quantity * prod.productId.price;
  }

  const sessionKey = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: products.map((p) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: p.productId.title,
          },
          unit_amount: p.productId.price * 100,
        },
        quantity: p.quantity,
      };
    }),
    mode: "payment",
    success_url: req.protocol + "://" + req.get("host") + "/checkout/success",
    cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
  });

  res.render("shop/checkout", {
    pageTitle: "Checkout",
    products: products,
    path: "/checkout",
    totalSum: totalSum,
    sessionId: sessionKey.id,
  });
};
