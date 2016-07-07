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

var customers = JSON.parse(fs.readFileSync(__dirname + "/new_customers.json").toString());  

router.get('/staffui/mvp/', function(req,res,next)
{
  req.data = req.data || {};
  req.data.cases = customers;
  next();  
});

router.get('/staffui/mvp/groupby/all', function(req,res,next)
{
  res.redirect('/staffui/mvp/');
  next();  
});

router.get('/staffui/mvp/advisers/', function(req,res,next)
{
  var customers = JSON.parse(fs.readFileSync(__dirname + "/new_customers.json").toString());  
  var advisers  = _.uniq(_.pluck(customers,"adviser"),false,function(p){ return p.id });
  
  req.data = req.data || {};
  req.data.advisers = advisers;
  next();  
});

router.get('/staffui/mvp/adviser/:id', function(req,res,next)
{
  var id = parseInt(req.params.id);
  
  var cases = _.filter(customers, function(el)
  {
    console.log(el.adviser.id,id); 
    return el.adviser.id == id;
  });

  req.data = req.data || {};
  req.data.cases = cases;
  req.url = '/staffui/mvp/adviser/';
  next();  
});

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

router.get('/staffui/mvp/customer/:id', function(req,res,next)
{
  var id = req.params.id;
  
  req.data = req.data || {};
  req.data.case = _.findWhere(customers, {'id':id});
  req.url = '/staffui/mvp/customer/';
  next();  
});

module.exports = router;
