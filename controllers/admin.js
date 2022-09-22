const Product = require("../models/product");
const fileHelper = require("../util/file");
const { validationResult } = require("express-validator");
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
  const photo = req.file;
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
  if (photo) {
    fileHelper.deleteFile(product.imageUrl);
    product.imageUrl = photo.path;
  }
  await product.save();

  res.redirect("/admin/products");
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.productId;
    const product = await Product.findById(id);
    fileHelper.deleteFile(product.imageUrl);
    await Product.deleteOne({ _id: id, userId: req.user._id });
    res.status(200).json({ message: "Success!" });
  } catch (err) {
    res.status(500).json({ message: "Deleting product failed." });
  }
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.desc;
  const photo = req.file;

  if (!photo) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      edit: false,
      hasError: true,
      errorMessages: [{ msg: "Invalid image format" }],
      prod: {
        title: title,
        price: price,
        description: description,
      },
    });
  }

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

  const imageUrl = photo.path;
  console.log(imageUrl);

  try {
    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user._id,
    });
    await product.save();
    res.redirect("/products");
  } catch (err) {
    const error = new Error("Creating new product failed");
    error.httpStatusCode = 500;
    return next(error);

    // res.redirect("/500")
  }
};
