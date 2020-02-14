const express = require("express");
var Router = express.Router();
var db = require('../models');
var path = require("path");


//Sign in Authentication Route

Router.post("/signin", function (req, res) {

    // Create a new User in the db
    db.User.create(req.body)
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(401).json(err))

    // If a User was created successfully, find one User (there's only one) and push the new User's _id to the User's `Users` array
    // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query

});

Router.get("/", function (req, res) {
    // rendering something to the page so it does not look so lonely
    // res.send('WELCOME TO THE UNRAVEL APP® API');
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// finds the thoughts of the user with their userId
Router.get('/user/thoughts/:userId', function (req, res) {

    // db.User.find() returns an array of all matches as result.
    db.User.findOne({ userId: req.params.userId }).populate("User").exec(
        function (err, dbuser) {
            var dbUserThoughts = null; // array of thought _ids 
            if (err) console.log(err);
            dbUserThoughts = dbuser.thoughts;
            console.log("USER IN MONGO DB: ", dbuser);
            console.log("USER ID: ", dbuser.userId);
            console.log("USER THOUGHTS: ", dbuser.thoughts);

            // if the user has thoughts 
            // first: take each thought to $in
            // second: for each $in, find all _id that matches db.Thought
            // third: for all _id found, populate "Thought"
            // fourth: after all "Thought" populated, execute fcn
            // fifth: function logs and sends responses.
            if (dbUserThoughts && dbUserThoughts.length) {
                db.Thought.find({ _id: { $in : dbUserThoughts }}).populate("Thought").exec(
                    function(err, dbthoughts) {
                        // logs errors
                        if (err) console.log(err); 
                        console.log("THOUGHTS IN DB", dbthoughts);
                        res.json(dbthoughts);
                });
            } else {
                // logs if user has no thoughts
                console.log("Something wrong with user thoughts id: ", dbUserThoughts);
            }
        });
});


// Route for saving a new thought to the db and associating it with a User
Router.post("/thoughts", function (req, res) {
    // console.log(req.body);

    // Create a new Thought in the db
    db.Thought.create(req.body)
        .then(function (dbThought) {
            // If a Thought was created successfully, find one User (there's only one) and push the new Thought's _id to the User's `thoughts` array
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            console.log("= INDEXJS DB THOUGHT =");
            console.log(req.body.userId + ":" + dbThought);

            // pushes the new thought into the database with existing userId
            // if the userId doesn't exist, create a new Userschema (upsert:true)
            return db.User.updateOne({ userId: req.body.userId }, { $push: { thoughts: dbThought._id } }, { upsert: true });

        })
        .then(function (dbUser) {
            // If the User was updated successfully, send it back to the client
            res.json(dbUser);
            console.log('indexjs line 83 dbUser - - > ', dbUser);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
            console.log(err);
        });
});

// get thoughts by their id
// - testing purpose
Router.get('/thoughts/:_id', function (req, res) {
    db.Thought.findById({ _id: req.params._id })
        .then(function (dbSaved) {
            res.json(dbSaved);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json('index line 104 error - - > ', err);
        });
});

// delete a thought by its id
// - testing purposes
Router.delete('/thoughts/:_id', function (req, res) {
    console.log("DELETE")
    db.Thought.findByIdAndDelete({ _id: req.params._id })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err)
        })
});

// gets all the thoughts
// - testing purpose
Router.get('/thoughts/all', function (req, res) {
    console.log("GET ALL THOUGHTS")
    db.Thought.find()
        .then(res => {
            console.log("/nALL THOUGHTS");
            console.log(res);
        })
        .catch(err => {
            console.log(err)
        })
});

module.exports = Router;
