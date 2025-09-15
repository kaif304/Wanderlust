const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// First Route / It shows all listings 
router.get("/",wrapAsync(listingController.index));


// New Route Get / To add a new listing route
router.get("/new", isLoggedIn, listingController.renderNewListingForm);

// New Route Post
router.post("/new", isLoggedIn, validateListing, wrapAsync(listingController.createNewListing));


// Show listing by a specific id
router.get("/:id", wrapAsync(listingController.showListingById));

// Edit Route / to edit opened listing 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
// Edit Route Put
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.editListing));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;