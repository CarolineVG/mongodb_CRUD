var express = require('express');
var router = express.Router();

/* mongo */
var mongo = require('mongodb');
var assert = require('assert');

/* make object of an id -> id in mongodb is of type object, not a string */
var objectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/test'; // run mongo terminal, read 2th line  + /databasename

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/get-data', function (req, res, next) {
  var resultArray = []; // empty array to store values from database 

  // connect to database
  mongo.connect(url, function (err, db) {
    // check if no errors
    assert.equal(null, err);
    // get items back
    var cursor = db.db('test').collection('user-data').find(); // find() -> all entries in this collection
    // run through all entries 
    cursor.forEach(function (doc, err) {
      assert.equal(null, err);
      // store the value in an array, to return to the view  
      resultArray.push(doc);
    }, function () {
      // callback -> after: close db, render index page with item resultarray 
      db.close();
      res.render('index', {
        items: resultArray
      });
    });
  });

});

router.post('/insert', function (req, res, next) {
  // create item
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  // connect to mongo db
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    // acces database, use collection to insert item 
    db.db('test').collection('user-data').insertOne(item, function (err, result) {
      // callback (if no errors)
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });
  // redirect to home page
  res.redirect('/');
});

/* UPDATE data */
router.post('/update', function (req, res, next) {
  
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  // you need the id to update an item
  var id = req.body.id; 
  
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    // arguments: item to replace, new item, callback
    db.db('test').collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function (err, result) { 
      // callback
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
  
  res.redirect('/');
});

router.post('/delete', function (req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  // you need the id to delete an item
  var id = req.body.id; 
  
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    // arguments: item to replace, new item, callback
    db.db('test').collection('user-data').deleteOne({"_id": objectId(id)}, function (err, result) { 
      // callback
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
  
  res.redirect('/');
});

module.exports = router;