let User = require("../modules/user");

module.exports.renderSignUp = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let userInfo = new User({ username, email });
    let registeredUser = await User.register(userInfo, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "New user registered sucessfully!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.render("./users/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.LogIn = async (req, res) => {
  req.flash("success", "Welcome to AirBnb! You are loged in.");
  // if (req.session.redirectUrl) return res.redirect(req.session.redirectUrl);
  if (res.locals.redirectUrl) return res.redirect(res.locals.redirectUrl);
  res.redirect("/listings");
};

module.exports.LogOut = (req, res) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "You are sucessfully logged out!");
      return res.redirect("/");
    }
  });
};
