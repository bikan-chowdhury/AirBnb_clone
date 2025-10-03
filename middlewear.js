let Listing = require("./modules/listing");
let Review = require("./modules/reviews");
const { listingSchema } = require("./schema.js");

module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be loged in to do this task!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (
    res.locals.currentUser &&
    !listing.owner._id.equals(res.locals.currentUser._id)
  ) {
    req.flash("error", "You are not the owner of this listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewId, id } = req.params;
  let review = await Review.findById(reviewId);
  if (
    res.locals.currentUser &&
    !review.author._id.equals(res.locals.currentUser._id)
  ) {
    req.flash("error", "You are not the author of this review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
