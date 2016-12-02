/*var path = require('path');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/shortly.sqlite')
  },
  useNullAsDefault: true
});
var db = require('bookshelf')(knex);

db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('baseUrl', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 100).unique();
      user.string('password', 100);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;

//*/

// Mongoose files

//var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var assert = require('assert');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var url = 'mongodb://localhost:27017/shortly-deploy';

// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log('connected to the,  server');

//   db.close();
// });

mongoose.connect(url);


var userSchema = mongoose.Schema({
  username: String, 
  password: String, 
  date: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  // console.log('inside comparePassword method');
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

// var User = mongoose.model('User', userSchema);

var urlSchema = mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  date: { type: Date, default: Date.now }
});

//can we just out this in the save method?
urlSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  // console.log('end initialize', this.code);
  next();
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('were connected');
});

module.exports = db;
module.exports.urlSchema = urlSchema;
module.exports.userSchema = userSchema;


// var myUrl = new Link({url: 'http://www.cnn.com/sports', title: 'nfl week 12', baseUrl: 'http://www.cnn.com' });

// myUrl.save(function(err, myUrl) {
//   if (err) { return console.error(err); }
//   console.log('We put this url in his place');    
// });

/*
var Ted = new User({username: 'Ted Kennedy', password: 'Mary Kopechney'});
var Bill = new User({username: 'William J Clinton', password: 'Monica Lewinski'});
var Arnold = new User({username: 'Governator', password: 'the name of his housekeeper'});

Ted.save(function(err, Ted) {
  if (err) { return console.error(err); }
  console.log('We put Ted in his place');    
});

Bill.save(function(err, Bill) {
  if (err) { return console.error(err); }
  console.log('We put Bill in his place');    
});

Arnold.save(function(err, Arnold) {
  if (err) { return console.error(err); }
  console.log('We put Arnold in his place');    
});

console.log(Ted.password);

console.log(User.find({username: 'Ted Kennedy'}));*/
