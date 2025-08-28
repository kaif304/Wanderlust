const express = require("express");
const router = express.Router();


// get for posts
router.get("/", (req,res)=>{
    res.send("GET for posts");
})

// get for posts id
router.get("/:id", (req,res)=>{
    res.send("GET for posts id");
})

// show posts
router.post("/", (req,res)=>{
    res.send("POST for posts");
})

// delete posts
router.delete("/:id", (req,res)=>{
    res.send("DELETE for posts");
})

module.exports = router;