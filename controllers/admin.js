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
    edit: false,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.prodId;

  Product.fetchProductById(prodId, (product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      edit: editMode,
      prod: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const updatedProduct = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.desc,
    id: prodId,
  };

  Product.fetchAll((products) => {
    for (let i = 0; i < products.length; i++) {
      if (products[i].id == prodId) products[i] = updatedProduct;
    }
    Product.saveProducts(products);
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
