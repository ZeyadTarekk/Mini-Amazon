const express = require("express");
const { check, body } = require("express-validator/check");

const User = require("../models/user");
const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please Enter a valid email."),
    body(
      "password",
      "Please Enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter a valid email.")
      .custom(async (value) => {
        const userWithSameEmail = await User.findOne({ email: value });

        if (userWithSameEmail) {
          throw new Error("This email is already registerd");
        }
        return true;
      }),
    body(
      "password",
      "Please Enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Confirm password and password must match");
      else return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
