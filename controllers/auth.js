const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  console.log(req.session.user);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = async (req, res, next) => {
  const user = await User.findById("6315e6995c4dc2cb6c8c58c5");
  req.session.user = user;
  res.redirect("/");
};
