const express = require("express");
var Router = express.Router();
var db = require('../models');


//Sign in Authentication Route

Router.post("/signin", function (req, res) {
    console.log(' R E Q ');
    console.log(req);
    console.log('REQ');
    console.log(' R E S ');
    console.log(res),
    console.log(' R E S ');

    // Create a new User in the db
    db.User.create(req.body)
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(401).json(err))
    
            // If a User was created successfully, find one User (there's only one) and push the new User's _id to the User's `Users` array
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            console.log("+++++++++++++")
            console.log(dbUser);
            console.log("+++++++++++")
});

Router.get("/", function (req, res) {
// rendering something to the page so it does not look so lonely
    res.send('WELCOME TO THE UNRAVEL APP® API');
});

Router.get('/user/thoughts/:id', function (req, res) {
    console.log('REQ / RES / REQ / RES / REQ / RES / REQ / RES');
    console.log(req);
    console.log(res);
    console.log('REQ / RES / REQ / RES / REQ / RES / REQ / RES');

    db.User.findById(req.params._id)
        .populate('thoughts')
        .then(function (dbSaved) {
            console.log("********************")
            console.log(dbSaved);
            console.log("**************");
            res.json(dbSaved);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});


// Route for saving a new thougt to the db and associating it with a User
Router.post("/thoughts", function (req, res) {
    console.log(req);
    console.log(res);
    // Create a new Thought in the db
    db.Thought.create(req.body)
        .then(function (dbThought) {
            // If a Thought was created successfully, find one User (there's only one) and push the new Thought's _id to the User's `thoughts` array
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            console.log("==========");
            console.log(dbThought);
            console.log("==========");
            console.log('req body userId -> ', req.body.userId);
            // .update({_id: contact.id}, upsertData
            return db.User.updateOne({ _id: req.body.userId }, { $push: { thoughts: dbThought._id } }, { new: true });
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


Router.get('/thoughts/:_id', function (req, res) {
    db.Thought.findById({_id: req.params._id})
        .then(function (dbSaved) {
            console.log("********************")
            console.log(dbSaved.thoughtId);
            console.log("**************");
            res.json(dbSaved);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

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



module.exports = Router;
