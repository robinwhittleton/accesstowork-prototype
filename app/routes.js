var express     = require('express'),
    fs          = require("fs"),
    router      = express.Router(),
    versions    = require(__dirname + '/../lib/versions.js'),
    user_data   = require(__dirname + '/../lib/user_data.js');

router.get(/dump/,function(req,res,next)
{
  console.log(req.cookies);
});

/*
  Cleaning up the cookies data.
  - - - - - - - - - - - - - - -
  Not sure this is needed anymore as I'm parsing JSON in
  the pages instead. Probably needs to be left for previous
  prototype versions.
*/
router.get(/.*/, function(req,res,next)
{
  for(var key in req.cookies)
  {
    var val;
    try {
      val = JSON.parse(req.cookies[key]);
    } catch(e) {
      val = req.cookies[key]
    }
    req.cookies[key] = val;
  }
  req.data = {};
  next();
});

/*
  Redirect from the old prototype folder into the new.
*/
router.get('/accesstowork/', function (req, res) {
  res.redirect('application/');
});

/*
  Special route for the index page.
*/
router.get('/', function (req, res) {
  res.render('index', versions);
});

/*
  API route for reading filename for the index page to call via AJAX.
*/
router.get(/\/api\/(.*)\//, function (req, res)
{
  var dir = __dirname + '/views/'+req.params[0]; console.log(dir);
  var filenames = fs.readdirSync(dir);
  for (var i=0; i<filenames.length; i++)
  {
    var isfile = fs.lstatSync(__dirname + '/views/'+req.params[0]+'/'+filenames[i]).isFile();
    if (isfile)
    {
      /*

      */
      var diff = filenames[i].substr(0,4);
      if (diff == 'diff')
      {
        filenames.splice(i,1);
        i--;
      }
    } else {
      filenames.splice(i,1);
      i--;
    }
  }
  res.json(filenames);
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


router.get('/v*/*', function(req, res, next)
{
  res.prototype = req.params[0];
  next();
});

router.all('/application/v[789]/need-tasks', function(req, res, next)
{
  // just take the first item out of the array.
  try {
    val = JSON.parse(req.cookies['what-you-need']);
    req.cookies['what-you-need'] = val[0];
  } catch(e) { }

  next();
});

router.all('/application/v[789]/need-why', function(req, res, next)
{
  // just take the first item out of the array.
  try {
    val = JSON.parse(req.cookies['what-you-need']);
    req.cookies['what-you-need'] = val[0];
  } catch(e) { }

  next();
});

/* sanitising data for the describe page */
router.get('/application/describe', function(req,res,next)
{
  if (req.cookies['explore-tasks'])
  {
    for (var i = 0; i < req.cookies['explore-tasks'].length; i++) {
      if (req.cookies['explore-tasks'][i] == '') {
        req.cookies['explore-tasks'].splice(i, 1);
        i--;
      }
    }
  } else {
    req.cookies['explore-tasks'] = ['Phone calls','Meetings']
  }
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

router.get(/\/offer\/offer*/, function(req,res,next)
{
  req.data.offers = [];
  if (req.cookies['explore-tasks'])
  for (var i = 0; i < req.cookies['explore-tasks'].length; i++)
  {
    var task = req.cookies['explore-tasks'][i];
    var how = req.cookies['explore-hows'][i];
    if (req.cookies['explore-offers']) var off = req.cookies['explore-offers'][i];
    // add them in if the task wasn't blank.
    if (task != '') req.data.offers[i] = {task:task,how:how,off:off};
  };
  console.log(req.data.offer);
  next();
});

router.get('/application/explore', function(req,res,next)
{
  res.cookie('taskcount',0);
  next();
});

router.get('/application/explore-another', function(req,res,next)
{
  req.cookies['taskcount']++;
  res.cookie('taskcount',req.cookies['taskcount']);
  // req.data.taskcount = req.cookies['taskcount'];
  next();
});

router.get('/application/travel*', function(req,res,next)
{
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
