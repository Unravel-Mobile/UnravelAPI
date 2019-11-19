const express = require("express");
var Router = express.Router();
var db = require('../models');


// Route for saving a new thougt to the db and associating it with a User
Router.post("/submit", function (req, res) {
    // Create a new Thought in the db
    db.Thought.create(req.body)
        .then(function (dbThought) {
            // If a Thought was created successfully, find one User (there's only one) and push the new Thought's _id to the User's `thoughts` array
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            console.log("==========")
            console.log(dbThought);
            console.log("==========")

            return db.User.findOneAndUpdate({}, { $push: { notes: dbThought._id } }, { new: true });
            // return 'YAHOO';
        })
        .then(function (dbUser) {
            // If the User was updated successfully, send it back to the client
            res.json(dbUser);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});
Router.post("/signin");

module.exports = Router;
