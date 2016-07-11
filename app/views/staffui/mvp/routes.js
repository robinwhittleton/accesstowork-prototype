var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    merge       = require("merge"),
    _           = require("underscore"),
    moment      = require('moment');
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    // db_url      = 'mongodb://localhost/accesstowork',
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

router.post('/staffui/mvp/customer/adviser/update', function(req,res,next)
{  
  var cid = req.body.case_id;
  var aid = parseInt(req.body.adviser_id);
  var advisers = JSON.parse(fs.readFileSync(__dirname + "/_data/advisers.json").toString());
  var newad = _.findWhere(advisers,{"id":aid});  
  store.findById(cid,function(err,the_case)
  {
    the_case.adviser = newad;
    store.updateById(the_case._id,the_case,function(err,doc)
    {
      res.status(200);
      res.send(JSON.stringify(newad));
    });
  });
});

router.post('/staffui/mvp/customer/cat/update', function(req,res,next)
{  
  var cid = req.body.case_id;
  var cat = req.body.category;

  store.findById(cid,function(err,the_case)
  {
    the_case.allocation = cat;
    store.updateById(the_case._id,the_case,function(err,doc)
    {
      res.status(200);
      res.send("success");
    });
  });
});

router.post('/staffui/mvp/customer/disc/update',function(req,res,next)
{
  var cid = req.body.case_id;
  var open = req.body.open;
  
  store.findById(cid,function(err,the_case)
  {
    the_case.open = open;
    store.updateById(the_case._id,the_case,function(err,doc)
    {
      res.status(200);
      res.send(JSON.stringify(doc));
    });
  });
});

router.post('/staffui/mvp/customer/cat/update', function(req,res,next)
{  
  var cid = req.body.case_id;
  var cat = req.body.category;

  store.findById(cid,function(err,the_case)
  {
    the_case.allocation = cat;
    store.updateById(the_case._id,the_case,function(err,doc)
    {
      res.status(200);
      res.send("success");
    });
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
});

module.exports = router;
