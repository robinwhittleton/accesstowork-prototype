var user_data = require('../lib/user_data.js');
var versions = require("../lib/versions.js");
var fs = require("fs");

module.exports = {
  bind : function (app) {    

    app.get(/.*/, function(req,res,next)
    {
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
  }
};