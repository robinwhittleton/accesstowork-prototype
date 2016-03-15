var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    _           = require("underscore"),
    moment      = require('moment');
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url),
    router      = express.Router();

util.tog = function(data)
{
  var o = '<pre>';
  o += util.inspect(data,{depth:10})
  o += '</pre>';
  return o;
}

router.get('/staffui/all/:order?', function(req,res,next)
{
  var order = req.params.order;

  if (order == 'status') order = 'statusIndex';
  else order = 'timet';

  var store = db.get('customers');
  store.find({},function(err,json)
  {
    if (json)
    {
      req.data = req.data || {};
      req.data.claimants  = _.sortBy(json,order);
      if (order == 'timet') req.data.claimants.reverse();

      req.data.counts = _.countBy(json,function(item){
        return item.status.waiting;
      });

      console.log(req.data.counts);

      req.url = '/staffui/all/';
      next();
    } else res.send('Empty data!');
  });
});

router.get('/staffui/adviser/:id?', function(req,res,next)
{
  var id = req.params.id;
  if (typeof id == "undefined") id = 0;

  var store = db.get('customers');
  store.find({},function(err,json)
  {
    var data = _.filter(json, function(el)
    {
      return el.adviser.id == id;
    });
    req.data = req.data || {};
    req.data.claimants = data;
    req.url = '/staffui/adviser/';
    next();
  });
});

router.get('/staffui/edit/claimant/:id?/', function(req,res,next)
{
  var id = req.params.id;
  if (typeof id == "undefined") res.send('Need an id in the URL please!')

  var advisers = JSON.parse(fs.readFileSync(__dirname + "/data-advisers.json").toString());

  var store = db.get('customers');
  store.findById(id, function(err,data)
  {
    // res.send(util.tog(data));

    req.data = req.data || {};
    req.data.claimant = data;
    req.data.advisers = advisers;
    req.url = '/staffui/edit_claimant';
    next();
  });
});

router.post('/staffui/edit/claimant/', function(req,res,next)
{

    var advisers = JSON.parse(fs.readFileSync(__dirname + "/data-advisers.json").toString());
    var adviser = _.findWhere(advisers, {"id":parseInt(req.body.adviser)});

    var store = db.get('customers');
    store.findById(req.body._id, function(err,data)
    {
      data.status = req.body.status;
      data.adviser = adviser;
      store.updateById(data._id,data, function(err,doc)
      {
        res.redirect('/staffui/edit/claimant/'+data._id);
      });
    });
});

router.get('/staffui/claimant/:id?/:page?/', function(req,res,next)
{
  var id = req.params.id;
  if (typeof id == "undefined") res.send('Need an id in the URL please!')

  var page = req.params.page;
  if (typeof page == "undefined") page = 'timeline';

  var store = db.get('customers');
  store.findById(id, function(err,data)
  {
    var timeline = JSON.parse(fs.readFileSync(__dirname + "/data-timeline.json").toString());
    var claims = JSON.parse(fs.readFileSync(__dirname + "/data-claims.json").toString());
    req.data = req.data || {};
    req.data.claimant = data;
    req.data.timeline = timeline;
    req.data.thispage = page;
    req.data.claim = _.sample(claims);
    req.url = '/staffui/claimant_'+page;
    next();
  });

  // json = JSON.parse(fs.readFileSync(__dirname + "/data-claimants.json").toString());
  // var data = _.filter(json, function(el) {
  //   return el.id == id;
  // });


});

router.get('/staffui/db',function(req,res,next)
{
  var stati = JSON.parse(fs.readFileSync(__dirname + "/data-stati.json").toString());

  var store = db.get('customers');
  store.find({}, function(err,docs)
  {
    var out = '<pre>';
    // out = util.inspect(stati,{depth:10})+"<br /><br />";
    _.each(docs,function(el,i)
    {
      // var w = el.status.waiting;
      // delete el.status.waiting;
      // el.status['awaiting'] = w;

      // output
      out += util.inspect(el,{depth:10})+"<br /><br />";

      // store.updateById(el._id,el,function(err,doc)
      // {
      //     // output
      //     out += util.inspect([err,doc],{depth:10})+"\n\n";
      // });

    });
    out += '</pre>';
    res.send(out);
  });
});

/*
  One time only to transfer data from file into MongoDB
  Commented so it doesn't get hit accidentally again.
*/
// router.get('/staffui/db',function(req,res,next)
// {
//   // res.send('fish');
//   var store = db.get('customers');
//   var json = JSON.parse(fs.readFileSync(__dirname + "/data-claimants.json").toString());
//   // res.send(util.inspect(json[0], {depth:10}));
//   _.each(json,function(el,i){
//     store.insert(el,function(err,doc)
//     {
//         if (i == json.length-1) res.send("done");
//     });
//   });
// });

module.exports = router;
