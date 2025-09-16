const express = require("express"); 
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

// SignUp Routes
router
    .route("/signup")
    .get(userController.renderSingnUpForm)
    .post(wrapAsync(userController.signup));

// Login Routes
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
    saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),
    userController.login);

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