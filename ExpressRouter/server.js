const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

// we cannot do anything with cookies before parsing them which done by cookie parser (npm library)
const cookieParser = require("cookie-parser");

// app.use(cookieParser());

/* 
to send the cookie with some secret code to check that the cookie 
is original, we send it {signed : true } and we pass a secret code in
cookie parser
*/
app.use(cookieParser("secretcode"));

// sending cookies to browser
app.get("/getcookies", (req,res)=> {
    res.cookie("greet","namaste");
    res.send("I am cookie route");
})

app.get("/greet", (req,res)=>{
    let {name = "random"} = req.cookies;
    res.send(`Hi ${name}`);
})

// sending signed cookies
app.get("/getsignedcookie", (req,res)=>{
    res.cookie("made-in","India",{signed:true});
    res.send("signed cookie sent");
})
// verify cookie
app.get("/verify",(req,res)=>{
    console.dir(req.signedCookies); // to access signed cookies
    res.send("verified");
})

app.get("/scookie", (req, res) => {
    res.cookie("user", "kaif", {signed: true});
    res.send("Cookie sent!");
})
app.get("/getscookie", (req, res) => {
    console.log(req.signedCookies);
    res.send(`Got: Hi ${req.signedCookies.user}`);
})

app.get("/", (req,res)=>{
    console.dir(req.cookies);
    res.send("Hi, I am root!");
})

/* 
All the requests comming for "/users" will be redirected to 
specific server which we have created in routes dir "user.js" to handle 
all types of request for users, like get, post, delete, etc.
*/
app.use("/users", users); 

/* 
All the requests comming for "/posts" will be redirected to 
specific server which we have created in routes dir "posts.js" to handle 
all types of request for users, like get, post, delete, etc.
*/
app.use("/posts", posts);

app.listen(3000, () => {
    console.log("http://localhost:3000");
});