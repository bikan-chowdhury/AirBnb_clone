require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./modules/reviews.js");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStatergy = require("passport-local");
const User = require("./modules/user.js");

const app = express();
let port = process.env.PORT;

// connecting to mongoDB database
const dbUrl = process.env.DB_URL;

main()
  .then(() => {
    console.log("Database connected sucessfully!");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE");
});

let sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/demouser", async (req, res) => {
  let demoUser = new User({
    email: "student@gmail.com",
    username: "firstStudent",
  });
  let newuser = await User.register(demoUser, "password");
  res.send(newuser);
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// 404 Route
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Middleweare for handling errors
app.use((err, req, res, next) => {
  const { message = "Something went wrong!", status = 500 } = err;
  res.status(status).render("error", { message, status });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
