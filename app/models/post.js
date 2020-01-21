//Databas-schema för posts
//*****************************

//Import av bibliotek
var mongoose = require('mongoose');

//Hämtar schema-klassen
var Schema = mongoose.Schema;

//Ny instans av schema-klassen
var postSchema = new Schema({
  title: String,
  url: String,
  author: String,
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  // category: String,
  votesUp: { type: Number, default: 0 },
  votesDown: { type: Number, default: 0 },
  createdAt: Date,
  comments: [{
    content: String
  }]
});

//Exporterar ovanatående schema-objekt.
module.exports = mongoose.model('Post', postSchema);
