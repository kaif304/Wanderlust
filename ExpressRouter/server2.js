const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
app.use(flash());

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));


const sessionOptions = {
    secret: "secretcode",
    resave: false,
    saveUninitialized: false
}
app.use(session(sessionOptions));

// middleware to set flash messages in locals reduce the bulking of code/route methods
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

// route to set session and see how this works
app.get("/test", (req,res)=>{
    console.log(req.session);
    res.send("<h1>Session test successfull</h1>");
})

// route to count the number of requests for the same route/page/session
app.get("/reqcount", (req,res)=>{
    if(req.session.count){
        req.session.count += 1;
    } else {
        req.session.count = 1;
    }
    res.send(`<h1>You have visited this page ${req.session.count} times</h1>`);
})

// app.get("/register", (req,res)=>{
//     const {name = "anonymous"} = req.query;
//     req.session.name = name;
//     req.flash("success", "User registered successfully");
//     res.redirect("/hello");
// })
app.get("/register", (req,res)=>{
    const {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "User not registered");
    } else {
        req.flash("success", "User registered successfully");
    }
    res.redirect("/hello");
})

app.get("/hello", (req, res) => {
    const {name = "anonymous"} = req.session;
    res.render("msgPage.ejs", {name: name});
});

app.get("/login", (req, res) => {
    const {name} = req.query;
    req.session.name = name;

    res.send("<h1>Welcome to the session and flash message demo</h1>");
});

app.get("/access", (req, res) => {
    let username = "kaif";

    if(req.session.name == username) {
        req.flash("Welcome to Data page");
    } else {
        req.flash("error", "You need to login first");
        res.send("<h1>Please login first</h1>");
        return;
    }
    res.send("<h1>You have athaurity to access data!</h1>");
});

app.listen(5000, ()=>{
    console.log("Server is running on port 5000");
})