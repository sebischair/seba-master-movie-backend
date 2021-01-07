"use strict";

const MovieModel = require("../models/movie");

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });

    try {
        let movie = await MovieModel.create(req.body);

        return res.status(201).json(movie);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};

const read = async (req, res) => {
    try {
        let movie = await MovieModel.findById(req.params.id).exec();

        if (!movie)
            return res.status(404).json({
                error: "Not Found",
                message: `Movie not found`,
            });

        return res.status(200).json(movie);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        });
    }
};

const update = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });
    }

    try {
        let movie = await MovieModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).exec();

        return res.status(200).json(movie);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};

const remove = async (req, res) => {
    try {
        await MovieModel.findByIdAndRemove(req.params.id).exec();

        return res
            .status(200)
            .json({ message: `Movie with id${req.params.id} was deleted` });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};

const list = async (req, res) => {
    try {
        let movies = await MovieModel.find({}).exec();

        return res.status(200).json(movies);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};

const getRate = async (req, res) => {
    try {
        let movieId = req.params.id;

        // get the movie
        let movieRating = await MovieModel.findById(movieId);

        // extract the average audience rating
        let rating = movieRating.avgAudienceRating;

        // return average audience rating
        return res.status(200).json({ rating: rating });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};

const rate = async (req, res) => {
    try {
        let votedMovieId = req.params.id;

        // find a movie that has the id and is voted by the user
        // returns null if the user has not voted this movie
        let alreadyVotedMovie = await MovieModel.findOne({
            _id: votedMovieId,
            "audienceRatings.userId": req.userId,
        });

        // check if user has already voted in this movie
        if (alreadyVotedMovie !== null) {
            // if the user has already voted update his voting entry
            await MovieModel.updateOne(
                {
                    _id: votedMovieId,
                    "audienceRatings.userId": req.userId,
                },
                {
                    $set: {
                        "audienceRatings.$.rating": req.body.rating,
                    },
                }
            );
        } else {
            // if the user has not voted create a new rating entry
            let ratingObject = {
                userId: req.userId,
                rating: req.body.rating,
            };
            await MovieModel.findByIdAndUpdate(votedMovieId, {
                $push: { audienceRatings: ratingObject },
            });
        }

        return res.status(200).json({});
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};

module.exports = {
    create,
    read,
    update,
    remove,
    list,
    rate,
    getRate,
};
