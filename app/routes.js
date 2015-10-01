var user_data = require('../lib/user_data.js');

module.exports = {
  bind : function (app) {    

    // special route for the index.
    app.get('/', function (req, res) {      
      res.render('index', {items:[
        {number:'8', date:'(pre 21st July)'},
        {number:'7', date:'(pre 7th July)'},
        {number:'6', date:'(pre 23rd June)'},
        {number:'5', date:'(pre 11th June)'},
        {number:'4', date:'(pre 4th June)'},
        {number:'3', date:'(pre 28th May)'},
        {number:'2', date:'(pre 18th May)'},
        {number:'1', date:'(pre 30th April)'},
        ]});
    });

    var fs = require("fs");

    app.get(/\/api\/(.*)\//, function (req, res) {      
      var tom = fs.readdirSync(__dirname + '/views/'+req.params[0]);
      for (var i=0; i<tom.length; i++)
      {
        var diff = tom[i].substr(0,4);
        if (diff == 'diff') 
        {
          var test = tom.splice(i,1);
          i--;
        }
      }
      res.json(tom);
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