"use strict";

const mongoose = require("mongoose");

// this is that the later created virtuals are included in the json send to the user
const opts = { toJSON: { virtuals: true } };

// Define schema for ratings
const RatingSchema = new mongoose.Schema({
    // user who gave the rating
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // rating of user
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
});

// Define schema for actors for one movie
const ActorSchema = new mongoose.Schema({
    // name of actor
    name: String,
    // played roles
    characters: [String],
});

// Define the movie schema
const MovieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        synopsis: String,
        runtime: Number,
        mpaa_rating: String,
        theaterRelease: Date,
        blurayRelease: Date,
        criticsRating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        audienceRatings: [RatingSchema],
        actors: [ActorSchema],
        thumbnail: String,
    },
    opts
);
// opts are added to MovieSchema since later we want to add calculated fields to the schema
// and we want that these calculated fields are included in the json object of the entry

RatingSchema.set("versionKey", false);
ActorSchema.set("versionKey", false);
MovieSchema.set("versionKey", false);
MovieSchema.set("timestamps", true);

// Virtuals are not stored in the db, they are calcualted on call
MovieSchema.virtual("year").get(function () {
    if (this.theaterRelease) {
        return this.theaterRelease.getFullYear();
    } else {
        return undefined;
    }
});
MovieSchema.virtual("avgAudienceRating").get(function () {
    let avgRating = 0;
    let ratings = 0;
    // if there are no ratings return 0
    if (this.audienceRatings.length === 0) {
        return 0;
    }
    this.audienceRatings.map((rating) => {
        if (typeof rating.rating === "number") {
            avgRating += rating.rating;
        }
        ratings++;
    });
    avgRating = avgRating / ratings;
    return avgRating;
});

// Export the Movie model
module.exports = mongoose.model("Movie", MovieSchema);
