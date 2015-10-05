var user_data = require('../lib/user_data.js');
var versions = require("../lib/versions.js");

module.exports = {
  bind : function (app) {    

    app.get('/accesstowork/', function (req, res) {      
      res.redirect('application/');
    });

    // special route for the index.
    app.get('/', function (req, res) {      
      res.render('index', versions);
    });

    var fs = require("fs");

    app.get(/\/api\/(.*)\//, function (req, res) 
    {      
      var filenames = fs.readdirSync(__dirname + '/views/'+req.params[0]);      
      for (var i=0; i<filenames.length; i++)
      {
        if (fs.lstatSync(filenames[i]).isFile())
        {
          var diff = filenames[i].substr(0,4);
          if (diff == 'diff') 
          {
            var test = filenames.splice(i,1);
            i--;
          }  
        }        
      }
      res.json(filenames);
    });    

    app.get('/examples/template-data', function (req, res) {
      res.render('examples/template-data', { 'name' : 'Test' });
      
    });
    
    // add your routes here
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

    app.all('/accesstowork/need-tasks', function(req, res, next)
    {
      // just take the first item out of the array.
      try {
        val = JSON.parse(req.cookies['what-you-need']);
        req.cookies['what-you-need'] = val[0];
      } catch(e) { }

      next();
    });

    app.all('/accesstowork/need-why', function(req, res, next)
    {
      // just take the first item out of the array.
      try {
        val = JSON.parse(req.cookies['what-you-need']);
        req.cookies['what-you-need'] = val[0];
      } catch(e) { }

      next();
    });
  }
};