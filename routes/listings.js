const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../modules/listing.js");
const { isLogedIn, isOwner, validateListing } = require("../middlewear.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index & Create Route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    validateListing,
    isLogedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createNewListing)
  );

// New Route
router.get("/new", isLogedIn, listingController.renderNewForm);

// Edit Route
router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.editListing)
);

// Show & Update Route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLogedIn,
    isOwner,
    upload.single("listing[image]"),
    listingController.updateListing
  );

// Delete Route
router.delete(
  "/:id",
  isLogedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
