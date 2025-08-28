const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js"); // error obj to throw errors
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

// Schema validator function to validate all filled fields in the form 
// It's using joi package to complete this task
let validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

// First Route / It shows all listings 
router.get("/",wrapAsync(async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New Route Get / To add a new listing route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});
// New Route Post
router.post("/new",validateListing, wrapAsync(async (req,res,next)=>{
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

// Show listing by a specific id
router.get("/:id", wrapAsync(async (req,res)=>{
    let  {id}  = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    res.render("listings/show.ejs", {listing});
}));

// Edit Route / to edit opened listing 
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));
router.put("/:id",validateListing, wrapAsync(async (req,res)=>{
    let  {id}  = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;