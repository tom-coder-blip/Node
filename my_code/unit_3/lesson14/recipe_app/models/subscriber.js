const mongoose = require('mongoose');

//schema creation
const subscriberSchema = mongoose.Schema({
    //schema properties
    name: String,
    email: String,
    zipCode: Number
});

module.exports = mongoose.model("Subscriber", subscriberSchema);


const commentSchema = new mongoose.Schema({
    recipeId: mongoose.SchemaType.Types.ObjectId,
    userName: String,
    commentText: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = mongoose.model("Comment", commentSchema);