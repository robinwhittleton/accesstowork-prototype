var express     = require('express'),
    fs          = require("fs"),
    _           = require("underscore"),
    moment      = require('moment');
    router      = express.Router();

router.get('/staffui/all/:order?', function(req,res,next)
{
  var order = req.params.order;
  if (order == 'status') order = 'statusIndex';
  else order = 'timet';

  json = JSON.parse(fs.readFileSync(__dirname + "/customers.json").toString());

  req.data.customers  = _.sortBy(json,order);

  if (order == 'timet') req.data.customers.reverse();

  req.data.counts     = _.countBy(json,"status");
  req.url = '/staffui/all/';
  next();
});

router.get('/staffui/adviser/:id?', function(req,res,next)
{
  var id = req.params.id;
  if (typeof id == "undefined") id = 0;
  
  json = JSON.parse(fs.readFileSync(__dirname + "/customers.json").toString());
  var data = _.filter(json, function(el)
  {
    return el.adviser.id == id;
  });
  req.data.customers = data;
  req.url = '/staffui/adviser/';
  next();
});

router.get('/staffui/api/people', function(req,res)
{  
  var advisers = JSON.parse(fs.readFileSync(__dirname + "/advisers.json").toString());
  var people = JSON.parse(fs.readFileSync(__dirname + "/raw-customers.json").toString());
  var stati = ['just in','allocated','gathering','waiting','support agreed','needs review'];
  var waiting = ['med ev','quotes','employer','extra info','assessment','offer sent'];  
  var person = _.sample(people), output = '';
  _.each(people,function(el,i,array)
  {
    var now = moment();
    var status = _.sample(stati);
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
  res.end(JSON.stringify(people));
});

router.get('/staffui/api/advisers', function(req,res)
{  
  var advisers = JSON.parse(fs.readFileSync(__dirname + "/advisers.json").toString());
  _.each(advisers,function(el,i,array)
  {
    el.id = i;
    delete el.region;
    delete el.gender;
  });
  res.end(JSON.stringify(advisers));
});

module.exports = router;