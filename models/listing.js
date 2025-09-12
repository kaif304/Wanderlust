const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    image: {
        type: String,
        // default: "https://th.bing.com/th/id/R.61f116c6f3f7be8e7d6f3cdb5e4638d4?rik=R7H7jKHMFDJVIw&riu=http%3a%2f%2ftravelingcanucks.com%2fwp-content%2fuploads%2f2017%2f05%2fTraveling_Canucks_Travel_Photography_005.jpg&ehk=n6LBIPuKPOXJo8B4qPbgN1J5M5t4XO7QWzxI6gqCOYQ%3d&risl=1&pid=ImgRaw&r=0",
        set: (v) => v === "" ? "https://th.bing.com/th/id/R.61f116c6f3f7be8e7d6f3cdb5e4638d4?rik=R7H7jKHMFDJVIw&riu=http%3a%2f%2ftravelingcanucks.com%2fwp-content%2fuploads%2f2017%2f05%2fTraveling_Canucks_Travel_Photography_005.jpg&ehk=n6LBIPuKPOXJo8B4qPbgN1J5M5t4XO7QWzxI6gqCOYQ%3d&risl=1&pid=ImgRaw&r=0" : v,
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in:listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;