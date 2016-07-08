var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    merge       = require("merge"),
    _           = require("underscore"),
    moment      = require('moment');
    // db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    db_url      = 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url),
    tog         = require(__dirname+'/../../../../lib/tog.js'),
    router      = express.Router();

var store = db.get('cases');

router.get('/staffui/mvp/login', function(req,res,next)
{
  store.find().then(function(cases)
  {
    req.data = req.data || {};
    req.data.advisers = _.uniq(_.pluck(cases,"adviser"),false,function(p){ return p.id });;
    next(); 
  });
});

router.get('/staffui/mvp/', function(req,res,next)
{
  store.find().then(function(cases)
  {
    req.data = req.data || {};
    req.data.cases = cases;  
    next();  
  });
});

/*
  LIST ALL ADVISERS
*/
router.get('/staffui/mvp/advisers/', function(req,res,next)
{
  store.find().then(function(cases)
  {
    var advisers  = _.uniq(_.pluck(cases,"adviser"),false,function(p){ return p.id });    
    req.data = req.data || {};
    req.data.advisers = advisers;
    next();  
  });
});

/*
  ADVISER CASES PAGE
*/
router.get('/staffui/mvp/adviser/:id', function(req,res,next)
{
  var id = parseInt(req.params.id);
  
  store.find().then(function(cases)
  {
    cases = _.filter(cases,function(el)
    {
        return el.adviser.id == id && el.open;
    });
    req.data = req.data || {};
    req.data.cases = cases;
    req.url = '/staffui/mvp/adviser/';
    next(); 
  }); 
});

/*
  ALL CASES GROUPS BY CATEGORY
*/
router.get('/staffui/mvp/groupby/:by', function(req,res,next)
{
  var by = req.params.by;
  
  if (by == "all") res.redirect('/staffui/mvp/');
  
  store.find().then(function(cases)
  {
    var cases = _.groupBy(cases,'allocation');
    
    req.data = req.data || {};
    req.data.by = by;
    req.data.cases = cases[by];
    req.url = '/staffui/mvp/';
    next();  
  });
});


/*
  CUSTOMER DETAILS PAGES.
*/
router.get('/staffui/mvp/customer/:id/:what?', function(req,res,next)
{
  var id = req.params.id;
  var what = (req.params.what) ? '_'+req.params.what : '_application';
  
  store.findById(id,function(err,cases)
  {
    var advisers = JSON.parse(fs.readFileSync(__dirname + "/_data/advisers.json").toString());  
    
    req.data = req.data || {};
    req.data.advisers = advisers;
    // req.data.case = _.findWhere(cases, {'_id':String(id)});
    req.data.case = cases;
    
    req.url = '/staffui/mvp/customer'+what+'/';
    next(); 
  });
  
  // store.findById(id).then(function(cases)
  // {
  //   // var cases = JSON.parse(fs.readFileSync(__dirname + "/_data/new_customers.json").toString());  
  //   var advisers  = _.uniq(_.pluck(cases,"adviser"),false,function(p){ return p.id });
  //   
  //   req.data = req.data || {};
  //   req.data.advisers = advisers;
  //   // req.data.case = _.findWhere(cases, {'_id':String(id)});
  //   req.data.case = cases;
  //   
  //   req.url = '/staffui/mvp/customer'+what+'/';
  //   next(); 
  // }); 
});

module.exports = router;
