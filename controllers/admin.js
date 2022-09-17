const Product = require("../models/product");
const { validationResult } = require("express-validator/check");
const mongoose = require("mongoose");
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
    hasError: false,
    errorMessages: [],
  });
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = Boolean(req.query.edit);

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.prodId;

  const product = await Product.findById(prodId);
  res.render("admin/edit-product", {
    pageTitle: `Edit ${product.title}`,
    path: "/admin/edit-product",
    hasError: false,
    edit: editMode,
    prod: product,
    errorMessages: [],
  });
};

exports.postEditProduct = async (req, res, next) => {
  const id = req.body.prodId;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.desc;
  const photo = req.body.photo;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: `Edit ${title}`,
      path: "/admin/edit-product",
      edit: true,
      prod: {
        _id: id,
        title: title,
        price: price,
        description: description,
        imageUrl: photo,
      },
      hasError: true,
      errorMessages: errors.array(),
    });
  }

  const product = await Product.findById(id);

  if (product.userId.toString() !== req.user._id.toString()) {
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
  await Product.deleteOne({ _id: id, userId: req.user._id });
  res.redirect("/admin/products");
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.desc;
  const photo = req.body.photo;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      edit: false,
      hasError: true,
      errorMessages: errors.array(),
      prod: {
        title: title,
        price: price,
        description: description,
        imageUrl: photo,
      },
    });
  }

  try {
    const product = new Product({
      _id: mongoose.Types.ObjectId("6315e7e4a19b071b89d365ab"),
      title: title,
      price: price,
      description: description,
      imageUrl: photo,
      userId: req.user._id,
    });
    await product.save();
    res.redirect("/products");
  } catch (error) {
    res.status(500).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      edit: false,
      hasError: true,
      errorMessages: [{ msg: "Database operation failed, try again!" }],
      prod: {
        title: title,
        price: price,
        description: description,
        imageUrl: photo,
      },
    });
    // res.redirect("/500")
  }
};
