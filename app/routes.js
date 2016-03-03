var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    router      = express.Router(),
    versions    = require(__dirname + '/../lib/versions.js'),
    user_data   = require(__dirname + '/../lib/user_data.js');

/*
  Special route for the index page.
*/
router.get('/', function (req, res) {
  res.render('index', versions);
});

/*
  Dump session data so I can see it.
*/
router.get('/session',function(req, res)
{
  var user = JSON.parse(fs.readFileSync(__dirname + "/views/application/session.json").toString());
  req.session.user = user;
  res.send("<pre>"+util.inspect(req.session,{depth:10})+"</pre>");
});

/*
  Removing all the cookies.
*/
router.get('/reset', function(req, res)
{
  user_data.clear(req, res);
  res.redirect('/');
});
router.get('/application/start', function(req, res, next)
{
  console.log('appstart reset');
  user_data.clear(req, res);
  next();
});

/*
  Diff pages
*/
router.get(/\/application\/v([0-9]+)\/diff/, function(req,res,next)
{
  var version = 'v'+req.params[0];
  json = JSON.parse(fs.readFileSync(__dirname + "/views/application/"+version+"/diff.json").toString());
  req.data.diffdata = json;
  req.data.vthis = req.params[0];
  req.data.vlast = req.params[0]-1;
  req.url = '/diff/';
  next();
});

/*
  Setting up some default data for use of the travel pages.
*/
router.get('/application/travel*', function(req,res,next)
{
  req.data = req.data || {};
  req.data.travel_options = [
    {"value":"walking",'label':"Walking"},
    {"value":"riding a bicycle",'label':"Bicycle"},
    {"value":"catching a bus or tram",'label':"Bus or tram"},
    {"value":"catching a train",'label':"Train"},
    {"value":"catching a tube",'label':"Tube"},
    {"value":"using your car or getting a lift",'label':"Car or get a lift"}
  ];
  next();
});

module.exports = router;
