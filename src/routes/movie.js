"use strict";

const express = require("express");
const router = express.Router();

const middlewares = require("../middlewares");
const MovieController = require("../controllers/movie");

router.get("/", MovieController.list); // List all movies
router.post(
    "/",
    middlewares.checkAuthentication,
    middlewares.checkIsAdmin,
    MovieController.create
); // Create a new movie, needs logged in user with the admin role
router.get("/:id", MovieController.read); // Read a movie by Id
router.put(
    "/:id",
    middlewares.checkAuthentication,
    middlewares.checkIsAdmin,
    MovieController.update
); // Update a movie by Id, needs logged in user with the admin role
router.delete(
    "/:id",
    middlewares.checkAuthentication,
    middlewares.checkIsAdmin,
    MovieController.remove
); // Delete a movie by Id, needs logged in user with the admin role
router.get("/rate/:id", MovieController.getRate); // Get the audience rating of this movie by Id
router.put("/rate/:id", middlewares.checkAuthentication, MovieController.rate); // Rate movie with Id. needs a logged in user

module.exports = router;
