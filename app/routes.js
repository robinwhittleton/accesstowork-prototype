var user_data = require('../lib/user_data.js');
var versions = require("../lib/versions.js");
var fs = require("fs");

module.exports = {
  bind : function (app) {    

    app.get(/.*/, function(req,res,next)
    {
      // clean up the cookies data!
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

    app.get('/accesstowork/', function (req, res) {      
      res.redirect('application/');
    });

    // special route for the index.
    app.get('/', function (req, res) {      
      res.render('index', versions);
    });

    app.get(/\/api\/(.*)\//, function (req, res) 
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
    
    app.get('/reset', function(req, res) 
    {
      user_data.clear(req, res);
      res.redirect('/')
    });

    
    app.get('/v*/*', function(req, res, next) 
    {
      res.prototype = req.params[0];
      next();
    });

    app.all('/application/need-tasks', function(req, res, next)
    {
      // just take the first item out of the array.
      try {
        val = JSON.parse(req.cookies['what-you-need']);
        req.cookies['what-you-need'] = val[0];
      } catch(e) { }

      next();
    });

    app.all('/application/need-why', function(req, res, next)
    {
      // just take the first item out of the array.
      try {
        val = JSON.parse(req.cookies['what-you-need']);
        req.cookies['what-you-need'] = val[0];
      } catch(e) { }

      next();
    });

    app.get('/staffui/all-applications', function(req,res,next)
    {
      req.data.customers = require("../lib/customers.js");      
      next();
    });

    /* sanitising data for the describe page */
    app.get('/application/describe', function(req,res,next)
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

    app.get(/\/offer\/offer*/, function(req,res,next)
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
  }
};