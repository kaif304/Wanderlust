const Listing = require("../models/listing");
const cloudinary = require("../cloudConfig.js");

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewListingForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.createNewListing = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const upload_stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "wanderlust_DEV",},
        async (error, result) => {
          if (error) {
            console.error("Error uploading image:", error);
            return res.status(500).json({ error: "Upload failed" });
          }

        let url = result.secure_url;
        let filename = result.asset_folder + "/" + result.display_name;

        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};

        await newListing.save();

        res.redirect("/listings");
      });

      upload_stream.end(req.file.buffer); // send buffer to Cloudinary
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    }
};
// req.flash("success","New Listing Created!");
// res.redirect("/listings");
//     let newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     await newListing.save();
// }

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