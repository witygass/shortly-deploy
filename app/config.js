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

var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var assert = require('assert');

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
// did not assign an id since Mongo also makes and id,  but be may need one to make this backwards compatible
});

var User = mongoose.model('User', userSchema);

var urlSchema = mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  date: { type: Date, default: Date.now }
});

var Link = mongoose.model('Link', urlSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('were connected');
//  var Ted = new User({username: 'Ted Kennedy', password: 'Mary Kopechney'});
});

var Ted = new User({username: 'Ted Kennedy', password: 'Mary Kopechney'});
Ted.save(function(err, Ted){
  if (err) {
    return console.error(err); }
  console.log('We put Ted in his place');    
});
console.log(Ted.password);

console.log(User.find({username: 'Ted Kennedy'}));
