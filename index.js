//Import av bibliotek
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

//Skapar instans av express
var app = express();

//Ansluter till databasen projectDB via localhost.
mongoose.connect('mongodb://localhost:27017/projectDB', {
  useNewUrlParser: true
});

//Ansluter till databas på Mlab.com.
// TODO: Nya inloggningsuppgifter
// mongoose.connect('mongodb+srv://linnea:kaptensdaleN99@cluster0-eijhp.mongodb.net/courses?retryWrites=true&w=majority', { useNewUrlParser: true });

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//Läser in databas-scheman
var Post = require('./app/models/post.js');
var Category = require('./app/models/category.js');

// Gör webbtjänsten tillgänglig från alla domäner
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  next();
});

//Skapar statisk sökväg varifrån den publika sidan ska hämtas
app.use(express.static(path.join(__dirname, 'public')));

//Port för anslutning
var port = 4000;

//Starta server
app.listen(port, function() {
  console.log(`Servern körs på port ${port}`);
});

//**************************************
//Hämta alla inlägg
//**************************************
app.get('/posts', function(req, res) {
  Post.find(function(err, Post) {
    if (err) {
      res.send(err);
    }
    res.json(Post);

  });
}); //end app.get

//**************************************
//Hämta enskilt inlägg
//**************************************
app.get('/posts/:postid', function(req, res) {
  //Hämtar medskickat _id.
  var singlePost = req.params.postid;
  console.log("Efterfrågat _id: " + singlePost);
  console.log(req);
  //Hämtar efterfrågat inlägg. Hanterar felmeddelanden.
  Post.find({
    _id: singlePost
  }, function(err, Post) {
    if (err) {
      res.send(err);
    }
    //Returnerar data för efterfrågat dokument.
    res.json(Post);
  });
}); //end app.get

//**************************************
//Lägga till inlägg
//**************************************
app.post('/posts', function(req, res) {
  var newpost = new Post();
  var categoryId = req.body.categoryId

  //Skapar nytt objekt
  newpost.title = req.body.title;
  newpost.url = req.body.url;
  newpost.category = [req.body.categoryId];
  newpost.votesUp = 0;
  newpost.votesDown = 0;
  newpost.comments = [];

  //Sparar till databasen med Mongoose. Hanterar felmeddelanden.
  newpost.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Lägger till inlägg.')
      // console.log(newpost._id);

      // Efterfrågar funktioner för populate i kategorifält
      // och för att lägga till inläggs-id i kategorin
      updateCategory(newpost._id, categoryId);
      populateCategoryField(newpost._id);
    }
  });
});

// Populate category-fält i inlägg
// Svaret loggas ut rätt i konsollen men sparas inte i databasen.
// Vad är det jag missar?
const populateCategoryField = (id) => {
    return Post.findOne(id)
    .populate('category', 'categoryName').exec((err, post) => {
    console.log("Populated Post: \n" + post);
    });
}

// Lägger till inläggs-id i kategori.
const updateCategory = (postId, categoryId) => {
  // Letar upp kategorin via id och lägger till det nya inläggets id.
  Category.findByIdAndUpdate(categoryId,
    {
      $push: { connectedPosts: postId }
    }, {
      safe: true,
      upsert: true,
      useFindAndModify: false,
      new: true
    },
    // OBS nedanstående "res" är bortkommenterat då det ger felmeddelande:
    // Cannot set headers after they are sent to the client
    // Vet dock inte hur jag annars ska återsända datan.

    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        //Returnerar data för efterfrågat dokument.
        // res.json(doc);
      }
    }
  );
}



//**************************************
//Ändra inlägg
//**************************************
app.put('/posts/:postid', function(req, res) {
  //Hämtar medskickat _id.
  var singlePost = req.params.postid;
  var body = req.body;

  console.log(singlePost);
  console.log(body);

  // Increment-funktionalitet för votesUp och votesDown.
  // // TODO: Röster skickas som bool - skriv in detta i readme
  // OBS att ändring av övriga fält inte kan göras tillsammans
  // med upp- eller ner-röster, i detta fall.
  if (req.body.votesUp) {
    body = {$inc: {'votesUp': 1}}
  } else if (req.body.votesDown) {
    body = {$inc: {'votesDown': 1}}
  }

  // Letar upp inlägget via id och gör en ändring.
  Post.findByIdAndUpdate(singlePost,
    body, {
      safe: true,
      upsert: true,
      useFindAndModify: false,
      new: true
    },
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        //Returnerar data för efterfrågat dokument.
        res.json(doc);
      }
    }
  );
});


//**************************************
//Ta bort inlägg
//**************************************
// TODO: Kolla att posten finns innan den tas bort!
// TODO: Skicka tillbaka hela listan??
app.delete('/posts/:postid', function(req, res) {
  //Hämtar medskickat _id.
  var singlePost = req.params.postid;
  console.log(singlePost);
  //Raderar kurs från databasen. Hanterar felmeddelanden.
  Post.deleteOne({
    _id: singlePost
  }, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send(true);
    }
  });
});

//**************************************
//Lägga till kommentar
//**************************************
app.post('/posts/:postid/comment', function(req, res) {
  //Hämtar medskickat _id.
  var singlePost = req.params.postid;
  var body = req.body;

  console.log(singlePost);
  console.log(body);

  // Letar upp inlägget via id och gör en push till comments-arrayen.
  Post.findByIdAndUpdate(singlePost, {
      $push: {
        comments: [{
          content: req.body.content
        }]
      }
    }, {
      safe: true,
      upsert: true,
      useFindAndModify: false,
      new: true
    },
    function(err, doc) {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        //Returnerar data för efterfrågat dokument.
        res.json(doc);
      }
    }
  );
});

//**************************************
//Ändra kommentar
//**************************************

// TODO: Fixa detta.

//**************************************
//Ta bort kommentar
//**************************************
app.delete('/posts/:postid/comment/:commentid', function(req, res) {

  //Hämtar medskickat _id.
  var singlePost = req.params.postid;
  var singleComment = req.params.commentid;

  console.log(singlePost);

  // Letar upp inlägget via id och gör en pull i comments-arrayen.
  Post.findByIdAndUpdate(singlePost, {
      $pull: {
        comments: {
          _id: singleComment
        }
      }
    }, {
      safe: true,
      upsert: true,
      useFindAndModify: false,
      new: true
    },
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        //Returnerar data för efterfrågat dokument.
        res.json(doc);
      }
    }
  );
});

//**************************************
//Hämta alla kategorier
//**************************************
app.get('/category', function(req, res) {
  Category.find(function(err, Category) {
    if (err) {
      res.send(err);
    }
    res.json(Category);

  });
}); //end app.get

//**************************************
//Lägga till kategori
//**************************************
app.post('/category', function(req, res) {
  //Ny instans av Post
  var newcategory = new Category();
  console.log(req.body);

  //Skapar nytt objekt
  newcategory.categoryName = req.body.categoryName;

  //Sparar till databasen med Mongoose. Hanterar felmeddelanden.
  newcategory.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Lägger till kategori.')
    }
  });
});
