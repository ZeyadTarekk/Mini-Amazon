exports.getAdminProducts = (req, res, next) => {
  res.render("admin/products.ejs", {
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};
