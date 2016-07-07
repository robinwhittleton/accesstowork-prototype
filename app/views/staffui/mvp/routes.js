var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    merge       = require("merge"),
    _           = require("underscore"),
    moment      = require('moment');
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url),
    tog         = require(__dirname+'/../../../../lib/tog.js'),
    router      = express.Router();

var customers = JSON.parse(fs.readFileSync(__dirname + "/_data/new_customers.json").toString());  
var customers = _.filter(customers, function(el)
{
  return el.open;
});
console.log(customers.length); 

router.get('/staffui/mvp/login', function(req,res,next)
{
  req.data = req.data || {};
  req.data.advisers = _.uniq(_.pluck(customers,"adviser"),false,function(p){ return p.id });;
  next();  
});

router.get('/staffui/mvp/', function(req,res,next)
{
  req.data = req.data || {};
  req.data.cases = customers;
  next();  
});

/*
  LIST ALL ADVISERS
*/
router.get('/staffui/mvp/advisers/', function(req,res,next)
{
  var customers = JSON.parse(fs.readFileSync(__dirname + "/_data/new_customers.json").toString());  
  var advisers  = _.uniq(_.pluck(customers,"adviser"),false,function(p){ return p.id });
  
  req.data = req.data || {};
  req.data.advisers = advisers;
  next();  
});

/*
  ADVISER CASES PAGE
*/
router.get('/staffui/mvp/adviser/:id', function(req,res,next)
{
  var id = parseInt(req.params.id);
  
  var cases = _.filter(customers, function(el)
  {
    console.log(el.adviser.id,id); 
    return el.adviser.id == id && el.open;
  });

  req.data = req.data || {};
  req.data.cases = cases;
  req.url = '/staffui/mvp/adviser/';
  next();  
});

/*
  ALL CASES GROUPS BY CATEGORY
*/
router.get('/staffui/mvp/groupby/:by', function(req,res,next)
{
  var by = req.params.by;
  
  var cases = _.groupBy(customers,'allocation');
  console.log(cases); 
  
  req.data = req.data || {};
  req.data.by = by;
  req.data.cases = cases[by];
  req.url = '/staffui/mvp/';
  next();  
});
//  REDIRECT ALL TO INDEX
router.get('/staffui/mvp/groupby/all', function(req,res,next)
{
  res.redirect('/staffui/mvp/');
  next();  
});

/*
  CUSTOMER DETAILS PAGES.
*/
router.get('/staffui/mvp/customer/:id/:what?', function(req,res,next)
{
  var id = req.params.id;
  var what = (req.params.what) ? '_'+req.params.what : '_application';
  
  var advisers  = _.uniq(_.pluck(customers,"adviser"),false,function(p){ return p.id });
  
  req.data = req.data || {};
  req.data.advisers = advisers;
  req.data.case = _.findWhere(customers, {'id':id});
  
  req.url = '/staffui/mvp/customer'+what+'/';
  next();  
});

module.exports = router;
