"use strict";

const mongoose = require("mongoose");

// Define the user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    // role of the user, used for rights management
    role: {
        type: String,
        // role can only take the values "member" and "admin"
        enum: ["member", "admin"],
        // if not specified the role "member" is chosen
        default: "member"
    }
});

UserSchema.set("versionKey", false);

// Export the User model
module.exports = mongoose.model("User", UserSchema);