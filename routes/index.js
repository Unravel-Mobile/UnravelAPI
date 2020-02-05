const express = require("express");
var Router = express.Router();
var db = require('../models');


//Sign in Authentication Route

Router.post("/signin", function (req, res) {
    console.log(' SIGN IN  R E Q ');
    console.log(req);
    console.log('SIGN IN  REQ');
    console.log(' SIGN IN  R E S ');
    console.log(res),
        console.log(' SIGN IN  R E S ');

    // Create a new User in the db
    db.User.create(req.body)
        .then(dbUser => res.json(dbUser))
        .catch(err => res.status(401).json(err))

    // If a User was created successfully, find one User (there's only one) and push the new User's _id to the User's `Users` array
    // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    // console.log("+++++++++++++")
    // console.log(dbUser);
    // console.log("+++++++++++")
});

Router.get("/", function (req, res) {
    // rendering something to the page so it does not look so lonely
    res.send('WELCOME TO THE UNRAVEL APP® API');
});

Router.get('/user/thoughts/:_id', function (req, res) {

    // console.log('* *  I N D E X J S  R E Q   B E L O W   T H I S   L I N E * *');
    // console.log(req);
    // console.log('*  * R E Q   A B O V E   T H I S   L  I N E * *');

    // console.log('* *  R E S   B E L O W   T H I S   L I N E * *');
    // console.log(res);
    // console.log('*  *  I N D E X J S   R E S   A B O V E   T H I S   L  I N E * *');

    db.User.findById({ _id: req.params._id })
        .populate('thoughts')
        .then(function (dbSaved) {
            res.json(dbSaved);
            console.log('* *  I N D E X J S  R E Q   P A R A M S * *');
            console.log(req.params);
            console.log('*  * I N D E X J S  R E Q   P A R A M S * *');
            console.log('****  WHAT WE HAVE ON DB - DBSAVED  ****')
            console.log(dbSaved);
            console.log('****  WHAT WE HAVE ON DB - DBSAVED THOUGHTS  ****')
            console.log(dbSaved.thoughts);
            console.log('****  WHAT WE HAVE ON DB  ****');
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});


// Route for saving a new thought to the db and associating it with a User
Router.post("/thoughts", function (req, res) {
    // console.log('INDEXJS POST REQ.BODY BELOW');
    // console.log(req.body);
    // console.log('INDEXJS POST REQ.BODY ABOVE');
    // console.log('========================================');
    // console.log('INDEXJS POST RES.BODY BELOW');
    // console.log(res.body);
    // console.log('INDEXJS POST RES.BODY ABOVE');
    // Create a new Thought in the db
    db.Thought.create(req.body)
        .then(function (dbThought) {
            // If a Thought was created successfully, find one User (there's only one) and push the new Thought's _id to the User's `thoughts` array
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            // console.log("*+=*+=*INDEXJS DB THOUGHT*+=*+=*+");
            // console.log(dbThought);
            // console.log("*+=*+=*INDEXJS DB THOUGHT*+=*+=*+");
            console.log('indexjs line 76 req body userId -> ', req.body.userId);
            // .update({_id: contact.id}, upsertData
            // return db.User.updateOne({ _id: req.body.userId }, { $push: { thoughts: dbThought._id } }, { new: true });
            return db.User.findOneAndUpdate({}, { $push: { thoughts: dbThought._id } }, { new: true });

            // return 'YAHOO';
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


Router.get('/thoughts/:_id', function (req, res) {
    db.Thought.findById({ _id: req.params._id })
        .then(function (dbSaved) {
            // console.log('++++++INDEXJS LINE 98 REQ.BODY BELOW+++++++++')
            // console.log(req.body);
            // console.log('++++++INDEXJS LINE 98 REQ.BODY ABEVR++++++++');
            res.json(dbSaved);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json('index line 104 error - - > ', err);
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
