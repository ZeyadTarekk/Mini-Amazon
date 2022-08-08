exports.getHomePage = (req, res, next) => {
  res.render("shop/index", {
    pageTitle: "Home Page",
    path: "/",
  });
};
