const express = require("express");
const router = express.Router();
let wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { route } = require("./listings");
const { saveRedirectUrl } = require("../middlewear");
const userController = require("../controllers/user");

router.get("/signup", userController.renderSignUp);

router.post("/signup", wrapAsync(userController.signUp));

router.get("/login", userController.renderLogin);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.LogIn
);

router.get("/logout", userController.LogOut);
module.exports = router;
