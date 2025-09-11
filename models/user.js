const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// User Schema
const userSchema = new Schema({
    email: {
        type: String, 
        required: true,
        unique: true,
    }
})

// adds username, hash and salt fields to store the username, the hashed password and the salt value
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);