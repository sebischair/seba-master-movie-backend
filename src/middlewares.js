"use strict";

const jwt = require("jsonwebtoken");

const config = require("./config");

const UserModel = require("./models/user");

const allowCrossDomain = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "*");

    // intercept OPTIONS method
    if ("OPTIONS" == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};

const checkAuthentication = (req, res, next) => {
    // check header or url parameters or post parameters for token
    let token = "";
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
        return res.status(401).send({
            error: "Unauthorized",
            message: "No token provided in the request",
        });

    // verifies secret and checks exp
    jwt.verify(token, config.JwtSecret, (err, decoded) => {
        if (err)
            return res.status(401).send({
                error: "Unauthorized",
                message: "Failed to authenticate token.",
            });

        // if everything is good, save to request for use in other routes
        req.userId = decoded._id;
        next();
    });
};

const checkIsAdmin = async (req, res, next) => {
    // checkAuthentication must be executed before this method
    // if not req.userId is not defined
    let user = await UserModel.findById(req.userId);

    if (user.role === "admin") {
        // if the user is an admin continue with the execution
        next();
    } else {
        // if the user is no admin return that the user has not the rights for this action
        return res.status(403).send({
            error: "Forbidden",
            message: "You have not the rights for this action.",
        });
    }
};

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.render("error", { error: err });
};

module.exports = {
    allowCrossDomain,
    checkAuthentication,
    checkIsAdmin,
    errorHandler,
};
