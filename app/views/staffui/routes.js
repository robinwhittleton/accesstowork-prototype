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

  json = JSON.parse(fs.readFileSync(__dirname + "/claimants.json").toString());

  req.data.claimants  = _.sortBy(json,order);

  if (order == 'timet') req.data.claimants.reverse();

  req.data.counts     = _.countBy(json,"status");
  req.url = '/staffui/all/';
  next();
});

router.get('/staffui/adviser/:id?', function(req,res,next)
{
  var id = req.params.id;
  if (typeof id == "undefined") id = 0;

  json = JSON.parse(fs.readFileSync(__dirname + "/claimants.json").toString());
  var data = _.filter(json, function(el)
  {
    return el.adviser.id == id;
  });
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

  json = JSON.parse(fs.readFileSync(__dirname + "/claimants.json").toString());
  var data = _.filter(json, function(el) {
    return el.id == id;
  });

  timeline = JSON.parse(fs.readFileSync(__dirname + "/timeline.json").toString());

  req.data.claimant = data[0];
  req.data.timeline = timeline;
  req.data.thispage = page;
  req.url = '/staffui/claimant_'+page;
  next();
});

module.exports = router;
