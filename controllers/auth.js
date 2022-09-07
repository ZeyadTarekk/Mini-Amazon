const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) message = message[0];
  else message = null;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const enteredPassword = req.body.password;
  const user = await User.findOne({ email: email });
  if (!user) {
    // wrong email
    req.flash("error", "This email is not registerd");
    return res.redirect("/login");
  }

  const hashedRightPassword = user.password;

  const comparisonResult = await bcrypt.compare(
    enteredPassword,
    hashedRightPassword
  );

  if (comparisonResult) {
    req.session.user = user;
    req.session.isLoggedIn = true;
    req.session.save((err) => {
      if (err) console.log(err);
      res.redirect("/");
    });
  } else {
    // Wrong Password
    req.flash("error", "Wrong Password");
    res.redirect("/login");
  }
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const userWithSameEmail = await User.findOne({ email: email });

  if (userWithSameEmail) return res.redirect("/signup");

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    email: email,
    password: hashedPassword,
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
