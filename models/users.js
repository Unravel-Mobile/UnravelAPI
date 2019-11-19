const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// defining userSchema
// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
// Each key in code userSchema defines a property in the documents which will be cast to its associated SchemaType.   https://mongoosejs.com/docs/guide.html#definition

// properties: title, subtitle, authors all on the left hand size before the :
// Schema Types on the right hand size of the : 
// all are strings and all but subtitle are required
// only google id is unique


const userSchema = new Schema({
    userId: {
        type: String
    },
    thoughtId: [{
        type: Schema.Types.ObjectId,
        ref: 'Thoughts'
        
    }]
});

// const user gets the DB so it can then be used elsewhere after export
const User = mongoose.model("User", userSchema);

// The module.exports or exports is a special object which is included in every JS file in the Node.js application by default. module is a variable that represents current module and exports is an object that will be exposed as a module. So, whatever you assign to module.exports or exports, will be exposed as a module.
module.exports = User;
