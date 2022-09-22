require("dotenv").config();
const { validationResult } = require("express-validator");
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
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const enteredPassword = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: enteredPassword,
      },
      validationErrors: errors.array(),
    });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    // wrong email
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: "This email is not registerd",
      oldInput: {
        email: email,
        password: enteredPassword,
      },
      validationErrors: [
        { param: "email", msg: "This email is not registerd" },
      ],
    });
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
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: "Wrong Password",
      oldInput: {
        email: email,
        password: enteredPassword,
      },
      validationErrors: [{ param: "password", msg: "Wrong Password" }],
    });
  }
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  console.log("Message", message);
  if (message.length > 0) message = message[0];
  else message = null;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
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
      from: process.env.SENDER_EMAIL,
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
        from: process.env.SENDER_EMAIL,
        subject: "Password Reset",
        html: `<p>You requested a password reset.</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password.</p>
        `,
      });
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  console.log(token);

  const neededUser = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (neededUser) {
    let message = req.flash("error");
    if (message.length > 0) message = message[0];
    else message = null;
    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "Reset Your Password",
      errorMessage: message,
      userId: neededUser._id.toString(),
      passwordToken: token,
    });
  } else {
    res.send("Invalid token");
  }
};

exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  const neededUser = await User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  });

  if (neededUser) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    neededUser.password = hashedPassword;
    neededUser.resetToken = undefined;
    neededUser.resetTokenExpiration = undefined;
    await neededUser.save();
    req.flash("error", "password reset succes");
    res.redirect("/login");
  }
};
