const User = require("../models/user.js");

module.exports.renderSingnUpForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res) => {  
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
}


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req,res) => {  
    req.flash("success", "You are logged in!");
    res.redirect(res.locals.redirectUrl || "/listings");
}