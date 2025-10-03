const Listing = require("../modules/listing");
const Review = require("../modules/reviews");
module.exports.createReviews = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();
  req.flash("success", "New review created.");
  console.log("new review saved!");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReviews = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  let deletedListing = await Review.findByIdAndDelete(reviewId);
  console.log(deletedListing);
  req.flash("error", "Review deleted.");
  res.redirect(`/listings/${id}`);
};
