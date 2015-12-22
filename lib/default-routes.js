var express = require('express');
var router = express.Router();
var user_data = require('../lib/user_data.js');
var versions = require("../lib/versions.js");
var fs = require("fs");
var merge = require('merge');

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
  redirect from the old prototype folder into the new.
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
  res.redirect('/')
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

router.get('/staffui/all-applications', function(req,res,next)
{
  req.data.customers = require("../lib/customers.js");      
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

router.get(/^\/([^.]+)$/, function (req, res) {

  var path = (req.params[0]);

  // remove the trailing slash because it seems nunjucks doesn't expect it.
  if (path.substr(-1) === '/') path = path.substr(0, path.length - 1);

  // try and render the path – it gets '.html' added 
  // to it and searches in your "app/views/" folder.
  res.render(path, merge(true, req.cookies, req.data), function(err, html)
  {
    // if it errors try seeing whether it's a folder 
    // name and look for an index.html file inside it.
    if (err) 
    {
      res.render(path + "/index", function(err2, html) 
      {
        if (err2) {
          // no, nothing exists anywhere for this route. 404!
          res.status(404).send('<b>'+path+' - not found</b><br />'+err+'<br />'+err2);
        } else {
          // it was a folder name.
          res.end(html);
        }
      });
    } else {
      // it was an html file.
      res.end(html);
    }
  });
});

router.post(/^\/([^.]+)$/, function (req, res) {
  var path = (req.params[0]);
  res.redirect('/'+path);
});

module.exports = router;