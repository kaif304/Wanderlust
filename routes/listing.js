const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing.js");

const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage })

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// First Route / It shows all listings
router.route("/").get(wrapAsync(listingController.index));

router
  .route("/new")
  .get(isLoggedIn, listingController.renderNewListingForm) // New Route Get / To add a new listing route
  // .post(isLoggedIn, validateListing, wrapAsync(listingController.createNewListing)); // New Route Post

  .post(upload.single("listing[image]"), listingController.createNewListing); // New Route Post

router
  .route("/:id")
  .get(wrapAsync(listingController.showListingById)) // Show listing by a specific id
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.editListing)) // Edit Route Put
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); // Delete Route

// Edit Route / to edit opened listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;









// Old way version of written routes

// // First Route / It shows all listings
// router.get("/",wrapAsync(listingController.index));

// // New Route Get / To add a new listing route
// router.get("/new", isLoggedIn, listingController.renderNewListingForm);

// // New Route Post
// router.post("/new", isLoggedIn, validateListing, wrapAsync(listingController.createNewListing));

// // Show listing by a specific id
// router.get("/:id", wrapAsync(listingController.showListingById));

// // Edit Route / to edit opened listing
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
// // Edit Route Put
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.editListing));

// // Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
