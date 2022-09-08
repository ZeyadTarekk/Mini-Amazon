const express = require("express");
const { check } = require("express-validator/check");

const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please Enter a valid email.")
    .custom((value) => {
      if (value === "test@test.com") {
        throw new Error("This email is forbidden");
      }
      return true;
    }),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
