const express = require('express');
const app = express();
const mongodb = require('mongodb').MongoClient;

const port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// APP SETTINGS
app.set('views', './src/views');
app.set('view engine', 'pug');

// STATIC FILES SETUP
// app.use(express.static('public')); // in case we had a 'public' dir with src
app.use(express.static('bower_components'));
app.use(express.static('dist'));

app.get('/', (req, res) => {
  var url = 'mongodb://localhost:27017/nodetv';
  mongodb.connect(url, function(err, db) {
    var collection = db.collection('shows');
    collection.find({}).toArray(function(err, results){
      res.render('index', {
        shows: results,
      })
    });
    db.close();
  });
})

app.post('/addshow', urlencodedParser, (req, res) => {
  // TODO: add check if show already exists
  // request manipulation
  var body = req.body;
  body.slug = req.body.name.toLowerCase().replace(/\s/gi, '-');
  // db connection
  var url = 'mongodb://localhost:27017/nodetv';
  mongodb.connect(url, function(err, db) {
      var collection = db.collection('shows'); // if it doesn't exist, mongoDB wil create it
      collection.insertOne(body, function(err, results){
          // callback after the insertion is done
          res.send(results);
          db.close();
      });
  });
});

app.get('/deleteAll', (req,res) => {
  var url = 'mongodb://localhost:27017/nodetv';
  mongodb.connect(url, function(err, db) {
      var collection = db.collection('shows'); // if it doesn't exist, mongoDB wil create it
      collection.deleteMany({}, function(err, results){
          // callback after the insertion is done
          res.send(results);
          db.close();
      });
  });
});
app.get('/deleteOne/:id', (req,res) => {
  var id = new require('mongodb').ObjectID(req.params.id)
  var url = 'mongodb://localhost:27017/nodetv';
  mongodb.connect(url, function(err, db) {
      var collection = db.collection('shows'); // if it doesn't exist, mongoDB wil create it
      collection.remove({'_id': id}, function(err, results){
          // callback after the insertion is done
          res.send(results);
          db.close();
      });
  });
});

app.get('/viewraw', (req,res) => {
  var url = 'mongodb://localhost:27017/nodetv';
  mongodb.connect(url, function(err, db) {
      var collection = db.collection('shows'); // if it doesn't exist, mongoDB wil create it
      collection.find({}).toArray(function(err, results){
          // callback after the insertion is done
          res.send(results);
          db.close();
      });
  });
});

app.get('/show/:slug', (req, res) => {
  var slug = req.params.slug;
  var url = 'mongodb://localhost:27017/nodetv';
  mongodb.connect(url, function(err, db) {
      var collection = db.collection('shows'); // if it doesn't exist, mongoDB wil create it
      collection.findOne({slug: slug}, function(err, result){
        if (result) {
          res.render('show', {
            show: result
          });
        } else {
          res.send(`the slug doesn't match any show in the db`);
        }
        db.close();
      })
    })
});

app.listen(port, function(err){
    console.log(`The server is running on port ${port}`);
})
