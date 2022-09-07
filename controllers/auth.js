const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = async (req, res, next) => {
  const user = await User.findById("6315e6995c4dc2cb6c8c58c5");
  req.session.user = user;
  req.session.isLoggedIn = true;
  req.session.save((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const userWithSameEmail = await User.findOne({ email: email });

  if (userWithSameEmail) return res.redirect("/signup");

  const newUser = new User({
    email: email,
    password: password,
    cart: {
      items: [],
    },
  });
  await newUser.save();

  res.redirect("/login");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
