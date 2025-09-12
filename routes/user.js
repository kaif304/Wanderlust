const express = require("express"); 
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// SignUp Route
router.get("/signup",(req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync( async (req,res) => {  
    try{
        let {username, email, password } = req.body;
        let newUser = new User({email, username});
    
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {  // to log in the user right after signing up
            if(err) return next(err);

            req.flash("success","Welcome to Wanderlust!");  
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}));

// Login Route
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),
    async (req,res) => {  
        req.flash("success", "You are logged in!");
        res.redirect(res.locals.redirectUrl || "/listings");
    }
);

// Logout Route
router.get("/logout",(req, res, next) => {
    req.logout((err) => {
        if (err) { 
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;