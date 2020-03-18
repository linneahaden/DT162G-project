//Databas-schema för posts
//*****************************

//Import av bibliotek
var mongoose = require('mongoose');

//Hämtar schema-klassen
var Schema = mongoose.Schema;

//Ny instans av schema-klassen
var postSchema = new Schema({
  title: {type: String, required: true},
  url: {type: String, required: true},
  author: String,
  // category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  category: {type: String, required: true},
  votesUp: { type: Number, default: 0 },
  votesDown: { type: Number, default: 0 },
  description: {type: String, required: true},
  createdAt: Date,
  comments: [{
    content: String
  }]
});

// function isMyFieldRequired () {
//     return typeof postSchema.url === 'string'? false : true
// }

//Exporterar ovanatående schema-objekt.
module.exports = mongoose.model('Post', postSchema);



// var userSchema = new mongoose.Schema({
//     myField: {
//         type: String,
//         required: isMyFieldRequired,
//     }
// });
