const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewListingForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createNewListing = async (req,res,next)=>{
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.showListingById = async (req,res)=>{
    let  {id}  = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}}) // populate author inside reviews
    .populate("owner");

    // If no listing found with that id
    if(!listing){
        req.flash("error","No Listing Found!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {listing});
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    // If no listing found with that id
    if(!listing){
        req.flash("error","No Listing Found!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs",{listing});
}

module.exports.editListing = async (req,res)=>{
    let  {id}  = req.params;

    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    req.flash("success","Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    
    req.flash("success","Listting Deleted!");
    res.redirect("/listings");
}