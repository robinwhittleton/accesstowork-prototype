var fs          = require('fs'),
    _           = require('underscore'),
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url),
    moment      = require('moment');

// load the raw data
var advisers = JSON.parse(fs.readFileSync(__dirname + "/data-advisers.json").toString());
var people = JSON.parse(fs.readFileSync(__dirname + "/data-raw-claimants.json").toString());
var stati = JSON.parse(fs.readFileSync(__dirname + "/data-stati.json").toString());
var conditions = JSON.parse(fs.readFileSync(__dirname + "/conditions.json").toString());

var waiting = ['med ev','quotes','employer','extra info','assessment','offer sent'];
var person = _.sample(people), output = '';

_.each(people,function(el,i,array)
{
  var now = moment();
  var status = _.sample(stati);
  el.id = i;
  // set status
  el.status = status;
  // set sortable status
  el.statusIndex = _.indexOf(stati,status);
  // if they're waiting - what for?
  el.status = (status == 'waiting') ? 'waiting: '+_.sample(waiting) : status;
  // if it's assigned - who to?
  el.adviser = (status != 'just in') ? _.sample(advisers) : 'none';
  // add a conditio
  el.condition = _.sample(conditions);
  // when was the status last changed.
  var r = Math.ceil(Math.random()*100)
  el.timet = now.subtract(r,'day').format("x");
  el.lastUpdated = now.subtract(r,'day').format("dddd, MMMM Do YYYY, h:mm:ss a");
  el.fromNow = now.subtract(r,'day').fromNow();
});

var store = db.get('user');
store.insert({name:"tom",surname:"morgan"});

// _.each(people, function(el,i)
// {
//   delete el.id;
//   console.log(el);
//
//   // var id = store.insert(el, function(err,doc){
//   //   console.log(err);
//   // });
//
// });

process.exit();

// fs.writeFileSync(__dirname + "/data-claimants.json", JSON.stringify(people));
