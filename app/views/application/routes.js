var express     = require('express'),
    fs          = require("fs"),
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url),
    user_data   = require(appRoot+'/lib/user_data.js'),
    router      = express.Router();

/*
  /application/start
  Clearing the session at the start of each application.
*/
router.get('/start', function(req, res, next)
{
  console.log('appstart reset');
  if (!req.session.coc) user_data.clear(req, res);
  next();
});

/*
  /application/during-work
  Making sure Deaf Fast-track users don't see the During Work questions.
*/
router.get('/during-work',function(req,res,next)
{
  /*
    If the user has seen the fast track
  */
  if (   (!req.session.user
      || !req.session.user.start
      || !req.session.user.start.fast)
      && !req.cookies.fast
    )
  {
    // res.send('showing During Work');
    // show the During Work quesitons.
    next();
  } else {
    // skip the During Work questions.
    // res.send('skipping During Work');
    res.redirect('/application/job-status');
  }
});

/*
  /application/job-status
  Saving the (anonymous) first part of the application to the db.
*/
router.get('/job-status',function(req, res, next)
{
  req.session.user = req.session.user || {};
  req.session.user.date = Date.now();
  var store = db.get('user');
  store.insert(req.session.user, function(err,id)
  {
    next();
  });
});

/*
  /application/travel*
  Setting up some default data for use of the travel pages.
*/
router.get('/travel*', function(req,res,next)
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

/*
  e.g. /application/v1/diff
  Diff pages
*/
router.get(/\/v([0-9]+)\/diff/, function(req,res,next)
{
  var version = 'v'+req.params[0];
  json = JSON.parse(fs.readFileSync(__dirname + "/"+version+"/diff.json").toString());
  req.data = req.data || {};
  req.data.diffdata = json;
  req.data.vthis = req.params[0];
  req.data.vlast = req.params[0]-1;
  req.url = '/diff/';
  next();
});

module.exports = router;
