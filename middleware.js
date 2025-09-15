const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js"); // error obj to throw errors
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;

        req.flash("error","You must be logged in first!");
        return res.redirect("/login");
    }
    next();
}

// save redirect url
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission!");
        return res.redirect(`/listings/${listing._id}`);
    }

    next();
}

// Schema validator function to validate all filled fields in the form 
// It's using joi package to complete this task
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

// middleware function to value review
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next) => {
    let {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You don't have permission!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}