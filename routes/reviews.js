const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../modules/listing.js");
const Review = require("../modules/reviews.js");
const { isLogedIn, isOwner, isReviewAuthor } = require("../middlewear.js");
const { createReviews, deleteReviews } = require("../controllers/review.js");

let validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Review route
router.post("/", isLogedIn, validateReview, wrapAsync(createReviews));
// Delete review
router.delete(
  "/:reviewId",
  isLogedIn,
  isReviewAuthor,
  wrapAsync(deleteReviews)
);

module.exports = router;
