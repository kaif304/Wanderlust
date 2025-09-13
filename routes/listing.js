const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// First Route / It shows all listings 
router.get("/",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));


// New Route Get / To add a new listing route
router.get("/new", isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

// New Route Post
router.post("/new", isLoggedIn, validateListing, wrapAsync(async (req,res,next)=>{
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));


// Show listing by a specific id
router.get("/:id", wrapAsync(async (req,res)=>{
    let  {id}  = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");

    // If no listing found with that id
    if(!listing){
        req.flash("error","No Listing Found!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {listing});
}));

// Edit Route / to edit opened listing 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    // If no listing found with that id
    if(!listing){
        req.flash("error","No Listing Found!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs",{listing});
}));
// Edit Route Put
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req,res)=>{
    let  {id}  = req.params;

    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    req.flash("success","Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    
    req.flash("success","Listting Deleted!");
    res.redirect("/listings");
}));

module.exports = router;