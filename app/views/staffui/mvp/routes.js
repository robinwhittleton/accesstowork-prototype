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
  // var keys = [];
  // for (var i = 0; i < customers.length; i++) {
  //   for (key in customers[i])
  //   {
  //     keys.push(key);
  //   }
  // }
  // var u = _.uniq(keys);
  // console.log(u); 
  next();  
});

router.get('/staffui/mvp/:id', function(req,res,next)
{
  var id = req.params.id;
  
  req.data = req.data || {};
  req.data.case = _.findWhere(customers, {'id':id});
  req.url = '/staffui/mvp/customer/';
  next();  
});

module.exports = router;
