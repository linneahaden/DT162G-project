//Databas-schema för category
//*****************************

//Import av bibliotek
var mongoose = require('mongoose');

//Hämtar schema-klassen
var Schema = mongoose.Schema;

//Ny instans av schema-klassen
var categorySchema = new Schema({
  categoryName:  {type: String, required: true},
  connectedPosts:  [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }
  ]
});

//Exporterar ovanatående schema-objekt.
module.exports = mongoose.model('Category', categorySchema);
