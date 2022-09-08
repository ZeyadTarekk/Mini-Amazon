const Product = require("../models/product");

exports.getAdminProducts = async (req, res, next) => {
  const products = await Product.find({ userId: req.user._id });
  res.render("admin/products.ejs", {
    pageTitle: "Admin Products",
    path: "/admin/products",
    prods: products,
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    edit: false,
  });
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.prodId;

  const product = await Product.findById(prodId);
  res.render("admin/edit-product", {
    pageTitle: `Edit ${product.title}`,
    path: "/admin/edit-product",
    edit: editMode,
    prod: product,
  });
};

exports.postEditProduct = async (req, res, next) => {
  const id = req.body.prodId;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.desc;
  const photo = req.body.photo;

  const product = await Product.findById(id);

  if (product.userId !== req.user._id) {
    return res.redirect("/");
  }

  product.title = title;
  product.price = price;
  product.description = description;
  product.imageUrl = photo;

  await product.save();

  res.redirect("/admin/products");
};

exports.postDeleteProduct = async (req, res, next) => {
  const id = req.body.prodId;
  await Product.findByIdAndDelete(id);
  res.redirect("/admin/products");
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.desc;
  const photo = req.body.photo;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: photo,
    userId: req.user._id,
  });
  await product.save();
  res.redirect("/products");
};
