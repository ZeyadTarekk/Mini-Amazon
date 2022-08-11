const Product = require("../models/product");

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products.ejs", {
      pageTitle: "Admin Products",
      path: "/admin/products",
      prods: products,
    });
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  console.log(editMode);
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    edit: editMode,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.desc;
  const photo = req.body.photo;
  const product = new Product(title, price, description, photo);
  product.save();
  res.redirect("/products");
};
