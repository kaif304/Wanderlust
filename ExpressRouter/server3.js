/*
Description: This code sets up an Express server with session
management using express-session. It includes routes for testing 
session functionality and flash messages.
*/

const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");

// express-session is middleware for managing sessions
// secret is used to sign the session ID cookie or any cookies
// to prevent tampering

app.use(session({secret : "mysupersecret"}));

app.get("/", (req, res) => {
    res.send("<h1>Welcome to the Express Server</h1>"); 
});

app.get("/test", (req, res) => {
    res.send("<h1>Test successful</h1>"); 
});

app.post("/greet", (req, res) => {
    res.send("<h1>Hello</h1>"); 
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});