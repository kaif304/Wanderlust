const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); // error obj to throw errors
const session = require("express-session");
const flash = require("connect-flash");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// Session configuration
const sessionConfig = {
    secret: "mysupersecretkey", // secret key for signing the session ID cookie
    resave: false,  
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // cookie expiration time (7 days)
        maxAge: 7 * 24 * 60 * 60 * 1000, // max age of the cookie in milliseconds
        httpOnly: true // prevents client-side JavaScript from accessing the cookie
    }
}

const listings = require("./routes/listing.js"); // listing related routes
const reviews = require("./routes/review.js"); // reviews related routes

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust",);
}
main()
.then(()=>{console.log('Connected');
})
.catch((err)=>{console.log(err);})

app.listen(8080,(req,res)=>{
    console.log('app is listening on port 8080');
});

app.get("/", (req,res)=>{
    res.send("Hi, i am root");
});

app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");

    // console.log("Response.Locals");
    // console.log(res.locals);

    // console.log("Response.Locals.Success");
    // console.log(res.locals.success);

    next();
});


// All requests comming to "/listings"
app.use("/listings", listings);

// All requests comming to "/listings/:id/reviews", basically for reviews
app.use("/listings/:id/reviews", reviews);


// If no route found above
app.use("*", (req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})


// Error Handler Middleware
app.use((err,req,res,next) => {
    let {statusCode=500,message="Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
});