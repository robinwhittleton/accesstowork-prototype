var fs      = require('fs'),
    _       = require('underscore'),
    moment  = require('moment');

// load the advisor data
var advisers = JSON.parse(fs.readFileSync(__dirname + "/advisers.json").toString());
// load the raw claimant data (from uinames.com)
var people = JSON.parse(fs.readFileSync(__dirname + "/raw-claimants.json").toString());
var stati = ['just in','allocated','gathering','waiting','support agreed','needs review'];
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
  // when was the status last changed.
  var r = Math.ceil(Math.random()*100)
  el.timet = now.subtract(r,'day').format("x"); 
  el.lastUpdated = now.subtract(r,'day').format("dddd, MMMM Do YYYY, h:mm:ss a"); 
  el.fromNow = now.subtract(r,'day').fromNow(); 
});  

fs.writeFileSync(__dirname + "/claimants.json", JSON.stringify(people));