const Product = require("../models/product");

exports.getAdminProducts = async (req, res, next) => {
  const products = await req.user.getProducts();
  // Product.fetchAll((products) => {
  res.render("admin/products.ejs", {
    pageTitle: "Admin Products",
    path: "/admin/products",
    prods: products,
  });
  // });
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

  const product = await req.user.getProducts({ where: { id: prodId } });
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    edit: editMode,
    prod: product[0],
  });
};

exports.postEditProduct = async (req, res, next) => {
  const id = req.body.prodId;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.desc;
  const photo = req.body.photo;

  const targetProduct = await Product.findByPk(id);
  targetProduct.title = title;
  targetProduct.price = price;
  targetProduct.description = description;
  targetProduct.imageUrl = photo;

  await targetProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.prodId;
  Product.destroy({ where: { id: id } });
  // Product.deleteProduct(id);
  res.redirect("/admin/products");
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.desc;
  const photo = req.body.photo;

  await req.user.createProduct({
    title: title,
    price: price,
    imageUrl: photo,
    description: description,
  });
  console.log("created Product");

  res.redirect("/products");
};
