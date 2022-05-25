"use strict";

// Configuration variables
const port = process.env.PORT || "4000";
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/moviedb";
const JwtSecret = process.env.JWT_SECRET || "very secret secret";

module.exports = {
    port,
    mongoURI,
    JwtSecret,
};
