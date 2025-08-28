const express = require("express");
const router = express.Router();

/* We can remove all the comman url path from path 
cause we are going to map it inside the server itself

so all the requests comming for users like get,post,delete, etc, 
we can remove users from path because it's common
*/

// get for users
router.get("/", (req,res)=>{
    res.send("GET for users");
})

// get for users id
router.get("/:id", (req,res)=>{
    res.send("GET for user id");
})

// show users
router.post("/", (req,res)=>{
    res.send("POST for users");
})

// delete users
router.delete("/:id", (req,res)=>{
    res.send("DELETE for users");
})

module.exports = router;