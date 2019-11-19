const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// defining thoughtSchema
// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
// Each key in code thoughtSchema defines a property in the documents which will be cast to its associated SchemaType.   https://mongoosejs.com/docs/guide.html#definition

// properties: title, subtitle, authors all on the left hand size before the :
// Schema Types on the right hand size of the : 
// all are strings and all but subtitle are required
// only google id is unique
const thoughtSchema = new Schema({
    title: { type: String, required: true },
    situation: { type: String, required: true },
    preRating: { type: Number, required: true },
    wordSelect1: [{ type: String, required: true }],
    autoThought: { type: String, required: true },
    changedThought: { type: String, required: true },
    postRating: { type: Number, required: true },
    wordSelect2: [{ type: String, required: true }],
    picture: { type: String }
});

// const Thoughts gets the DB so it can then be used elsewhere after export
const Thought = mongoose.model("Thought", thoughtSchema);

// The module.exports or exports is a special object which is included in every JS file in the Node.js application by default. module is a variable that represents current module and exports is an object that will be exposed as a module. So, whatever you assign to module.exports or exports, will be exposed as a module.
module.exports = Thought;
