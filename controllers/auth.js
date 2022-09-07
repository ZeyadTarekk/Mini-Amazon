require("dotenv").config();

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.API_KEY,
    },
  })
);

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
  let message = req.flash("error");
  if (message.length > 0) message = message[0];
  else message = null;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const userWithSameEmail = await User.findOne({ email: email });

  if (userWithSameEmail) {
    req.flash("error", "This email is already registerd");
    return res.redirect("/signup");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    email: email,
    password: hashedPassword,
    cart: {
      items: [],
    },
  });
  await newUser.save();

  try {
    await transporter.sendMail({
      to: email,
      from: "zeyad@node.com",
      subject: "Signup succeeded!",
      html: "<h1>You Successfully signed up!</h1>",
    });
  } catch (err) {
    console.log(err);
  }

  res.redirect("/login");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) message = message[0];
  else message = null;
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Your Password",
    errorMessage: message,
  });
};

exports.postReset = async (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/login");
    }
    const token = buffer.toString("hex");
    const neededUser = await User.findOne({ email: req.body.email });
    if (!neededUser) {
      req.flash("error", "No account with that email!");
      return res.redirect("/reset");
    }

    neededUser.resetToken = token;
    neededUser.resetTokenExpiration = Date.now() + 3600000; //increase one hour in milliseconds
    await neededUser.save();

    try {
      await transporter.sendMail({
        to: req.body.email,
        from: "zeyad@node.com",
        subject: "Password Reset",
        html: `<p>You requested a password reset.</p>
        <p>Click this <a href="https://localhost:3000/reset/${token}">Link</a> to set a new password.</p>
        `,
      });
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
};
