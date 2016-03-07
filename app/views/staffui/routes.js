var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    _           = require("underscore"),
    moment      = require('moment');
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url),
    router      = express.Router();

router.get('/staffui/db',function(req,res,next)
{
  // res.send('fish');
  var store = db.get('customers');
  var json = JSON.parse(fs.readFileSync(__dirname + "/data-claimants.json").toString());
  // res.send(util.inspect(json[0], {depth:10}));
  _.each(json,function(el,i){
    store.insert(el,function(err,doc)
    {
        if (i == json.length-1) res.send("done");
    });
  });
});

router.get('/staffui/all/:order?', function(req,res,next)
{
  var order = req.params.order;
  if (order == 'status') order = 'statusIndex';
  else order = 'timet';

  // json = JSON.parse(fs.readFileSync(__dirname + "/data-claimants.json").toString());
  var store = db.get('customers');
  store.find({},function(err,json)
  {
    // res.send(util.inspect(json));
    if (json)
    {
      req.data = req.data || {};
      req.data.claimants  = _.sortBy(json,order);
      if (order == 'timet') req.data.claimants.reverse();
      req.data.counts     = _.countBy(json,"status");
      req.url = '/staffui/all/';
      next();
    } else res.send('Empty data!');
  });
});

router.get('/staffui/adviser/:id?', function(req,res,next)
{
  var id = req.params.id;
  if (typeof id == "undefined") id = 0;

  json = JSON.parse(fs.readFileSync(__dirname + "/data-claimants.json").toString());
  var data = _.filter(json, function(el)
  {
    return el.adviser.id == id;
  });

  req.data = req.data || {};
  req.data.claimants = data;
  req.url = '/staffui/adviser/';
  next();
});

router.get('/staffui/claimant/:id?/:page?/', function(req,res,next)
{
  var id = req.params.id;
  if (typeof id == "undefined") id = 0;

  var page = req.params.page;
  if (typeof page == "undefined") page = 'timeline';

  json = JSON.parse(fs.readFileSync(__dirname + "/data-claimants.json").toString());
  var data = _.filter(json, function(el) {
    return el.id == id;
  });

  timeline = JSON.parse(fs.readFileSync(__dirname + "/data-timeline.json").toString());

  var claims = JSON.parse(fs.readFileSync(__dirname + "/data-claims.json").toString());

  req.data = req.data || {};
  req.data.claimant = data[0];
  req.data.timeline = timeline;
  req.data.thispage = page;
  req.data.claim = _.sample(claims);
  req.url = '/staffui/claimant_'+page;
  next();
});

module.exports = router;
