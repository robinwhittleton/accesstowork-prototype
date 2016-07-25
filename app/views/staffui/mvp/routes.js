var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    merge       = require("merge"),
    _           = require("underscore"),
    moment      = require('moment'),
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    // db_url      = 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url),
    tog         = require(appRoot + '/lib/tog.js'),
    router      = express.Router();

var store = db.get('cases');

router.get('/login', function(req,res,next)
{
  store.find({}).then(function(cases)
  {
    req.data = req.data || {};
    req.data.advisers = JSON.parse(fs.readFileSync(__dirname + "/_data/advisers.json").toString());
    next();
  });
});

router.get('/', function(req,res,next)
{
  store.find({"open":true}).then(function(cases)
  {
    req.data = req.data || {};
    req.data.by = "all";
    req.data.cases = cases;
    next();
  });
});

router.get('/show/closed/', function(req,res,next)
{
  store.find({"open":false}).then(function(cases)
  {
    req.data = req.data || {};
    req.data.title = "Closed (in DISC)";
    req.data.cases = cases;
    req.url = '/';
    next();
  });
});

/*
  ALL CASES GROUPS BY CATEGORY
*/
router.get('/groupby/:by', function(req,res,next)
{
  var by = req.params.by;

  if (by == "all") res.redirect('/');

  store.find({"open":true}).then(function(cases)
  {
    var cases = _.groupBy(cases,'allocation');

    req.data = req.data || {};
    req.data.by = by;
    req.data.cases = cases[by];
    req.url = '/';
    next();
  });
});

/*
  LIST ALL ADVISERS
*/
router.get('/advisers/', function(req,res,next)
{
  var advisers = JSON.parse(fs.readFileSync(__dirname + "/_data/advisers.json").toString());
  req.data = req.data || {};
  req.data.advisers = advisers;
  next();
});

/*
  ADVISER CASES PAGE
*/
router.get('/adviser/:id', function(req,res,next)
{
  var id = parseInt(req.params.id);

  store.find({"adviser.id":id,"open":true}).then(function(cases)
  {
    req.data = req.data || {};
    req.data.cases = cases;
    req.url = '/adviser/';
    next();
  });
});

/*
  UPDATE - THIS CASE'S ADVISER
*/
router.post('/customer/adviser/update', function(req,res,next)
{
  var cid = req.body.case_id;
  var aid = parseInt(req.body.adviser_id);
  var advisers = JSON.parse(fs.readFileSync(__dirname + "/_data/advisers.json").toString());
  var newad = _.findWhere(advisers,{"id":aid});
  store.findOne({"_id":cid}).then(function(the_case)
  {
    the_case.adviser = newad;
    store.update({"_id":the_case._id},the_case,function(err,doc)
    {
      res.status(200);
      res.send(JSON.stringify(newad));
    });
  });
});

/*
  UPDATE - THIS CASE'S IN DISC MARKER ("open")
*/
router.post('/customer/disc/update',function(req,res,next)
{
  var cid = req.body.case_id;
  var open = req.body.open;

  store.findOne({"_id":cid}).then(function(the_case)
  {
    the_case.open = open;
    store.update({"_id":the_case._id},the_case,function(err,doc)
    {
      res.status(200);
      res.send(JSON.stringify(doc));
    });
  });
});

/*
  UPDATE - THIS CASE'S CATEGORY
*/
router.post('/customer/cat/update', function(req,res,next)
{
  var cid = req.body.case_id;
  var cat = req.body.category;

  store.findOne({"_id":cid}).then(function(the_case)
  {
    the_case.allocation = cat;
    store.update({"_id":the_case._id},the_case,function(err,doc)
    {
      res.status(200);
      res.send("success");
    });
  });
});

/*
  CUSTOMER DETAILS PAGES.
*/
router.get('/customer/:id/:what?', function(req,res,next)
{
  var id = req.params.id;
  var what = (req.params.what) ? '_'+req.params.what : '_application';

  store.findOne({"_id":id}).then(function(cases)
  {
    var advisers = JSON.parse(fs.readFileSync(__dirname + "/_data/advisers.json").toString());

    req.data = req.data || {};
    req.data.advisers = advisers;
    // req.data.case = _.findWhere(cases, {'_id':String(id)});
    req.data.case = cases;

    req.url = '/customer'+what+'/';
    next();
  });
});

module.exports = router;
