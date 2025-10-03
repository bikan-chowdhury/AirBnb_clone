const Listing = require("../modules/listing.js");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (listing) {
    res.render("./listings/show", { listing });
  } else {
    req.flash("error", "Listing you are looking for does not exist!");
    res.redirect("/listings");
  }
};

module.exports.createNewListing = async (req, res, next) => {
  let url = req.file.path;
  let fileName = req.file.filename;
  if (!req.body.listing) {
    throw new ExpressError("Send valid data", 400);
  }
  // console.log(url, "----", fileName);
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, fileName };
  await newListing.save();

  req.flash("success", "New listing is created!");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let originalImgUrl = listing.image.url.replace(
    "/upload",
    "/upload/h_200,w_350"
  );
  res.render("./listings/edit.ejs", { listing, originalImgUrl });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError("Send valid data", 400);
  }
  let { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let fileName = req.file.filename;
    updatedListing.image = { url, fileName };
    await updatedListing.save();
  }

  req.flash("success", "Details updated sucessfully.");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("error", "Listing deleted sucessfully!");
  res.redirect("/listings");
};
