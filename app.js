if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); // error obj to throw errors
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


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

const listingRouter = require("./routes/listing.js"); // listing related routes
const reviewRouter = require("./routes/review.js"); // reviews related routes
const userRouter = require("./routes/user.js"); // user related routes - signup, login, logout

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust",);
}
main()
.then(()=>{console.log('Connected');
})
.catch((err)=>{console.log(err);})

app.listen(8080,(req,res)=>{
    console.log('Server --> http://localhost:8080');
});

app.get("/", (req,res)=>{
    res.send("Hi, i am root");
});

app.use(session(sessionConfig));
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash middleware to define & pass flash messages to all templates
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;

    next();
});

// route to create a false/demo user
// app.get("/demouser", async (req,res) => {
//     let user = new User({
//         email: "student123@gmail.com",
//         username: "parulStudent"
//     });

//     let registeredUser = await User.register(user, "helloworld");
//     res.send(registeredUser);
// });

// All requests comming to "/listings"
app.use("/listings", listingRouter);

// All requests comming to "/listings/:id/reviews", basically for reviews
app.use("/listings/:id/reviews", reviewRouter);

// User related routes - signup, login, logout
app.use("/", userRouter);


// If no route found above
app.use("*", (req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})


// Error Handler Middleware
app.use((err,req,res,next) => {
    let {statusCode=500,message="Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
});