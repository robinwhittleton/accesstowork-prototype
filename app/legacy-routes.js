var express     = require('express'),
    router      = express.Router();

/*
  Doing a bit of cookie shenanagins for some older versions.
*/
router.get(/\/application\/v([0-9]+)\/explore/, function(req,res,next)
{
  res.cookie('taskcount',0);
  next();
});

/*
Some extra cookie messing for previous prototype versions.
*/
router.get('/application/v10/explore-another', function(req,res,next)
{
  req.cookies['taskcount']++;
  res.cookie('taskcount',req.cookies['taskcount']);
  // req.data.taskcount = req.cookies['taskcount'];
  next();
});

/* sanitising data for the old describe page */
router.get(/\/application\/v([0-9]+)\/describe/, function(req,res,next)
{
  console.log('describe!!!');
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
  Redirect from the old prototype folder into the new.
*/
router.get('/accesstowork/', function (req, res) {
  res.redirect('application/');
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
  next();
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
  Passing version number into the page.
  Don't know if it's needed anymore.
*/
router.get('*/v*/*', function(req, res, next)
{
  res.prototype = req.params[1];
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

module.exports = router;
