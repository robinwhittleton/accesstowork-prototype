var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    _           = require("underscore"),
    moment      = require('moment');
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url),
    tog         = require(__dirname+'/../../../../lib/tog.js'),
    router      = express.Router();

var url_root = '/staffui/v1';

router.get('/staffui/all',function(req,res,next)
{
  res.redirect(url_root+'/all');
});

router.get(url_root+'/all/', function(req,res,next)
{
  var order = req.params.order;

  if (order == 'status') order = 'statusIndex';
  else order = 'timet';

  var store = db.get('customers');
  store.find({}).then(function(json)
  {
    if (json)
    {
      req.data = req.data || {};
      req.data.claimants  = _.sortBy(json,order);
      if (order == 'timet') req.data.claimants.reverse();
      req.data.counts = _.countBy(json,function(item){
        return item.status.awaiting;
      });
      req.url = url_root+'/all/';
      next();
    } else res.send('Empty data!');
  });
});

router.get(url_root+'/adviser/:id?', function(req,res,next)
{
  var id = req.params.id;
  if (typeof id == "undefined")
  {
    res.redirect(url_root+'/adviser/'+Math.floor(Math.random()*30));
  }
  var store = db.get('customers');
  store.find({}).then(function(json)
  {
    var data = _.filter(json, function(el)
    {
      return el.adviser.id == id && el.status.awaiting == 'adviser';
    });

    var number = data.length;

    // if no data just grab some so we have the adviser name.
    if (!number)
    {
      var data = _.filter(json, function(el) { return el.adviser.id == id; });
    }

    req.data = req.data || {};
    req.data.number = number;
    req.data.claimants  = _.sortBy(data,'timet').reverse();
    req.url = url_root+'/adviser/';
    next();
  });
});

router.get(url_root+'/edit/claimant/:id?/timeline', function(req,res,next)
{
  var id = req.params.id;
  if (typeof id == "undefined") res.send('Need an id in the URL please!')

  var timeline = JSON.parse(fs.readFileSync(__dirname + "/data-timeline.json").toString());

  var store = db.get('customers');
  store.findOne({"_id":id}).then(function(data)
  {
    data.timeline = _.sample(timeline,10);
    res.send(tog(data));
  });
});


router.get(url_root+'/edit/claimant/:id?/', function(req,res,next)
{
  var id = req.params.id;
  if (typeof id == "undefined") res.send('Need an id in the URL please!')

  var advisers = JSON.parse(fs.readFileSync(__dirname + "/data-advisers.json").toString());

  var store = db.get('customers');
  store.findOne({"_id":id}).then(function(data)
  {
    // res.send(util.tog(data));

    req.data = req.data || {};
    req.data.claimant = data;
    req.data.advisers = advisers;
    req.url = url_root+'/edit_claimant';
    next();
  });
});

router.post(url_root+'/edit/claimant/', function(req,res,next)
{

    var advisers = JSON.parse(fs.readFileSync(__dirname + "/data-advisers.json").toString());
    var adviser = _.findWhere(advisers, {"id":parseInt(req.body.adviser)});

    var store = db.get('customers');
    store.findOne({"_id":req.body._id}).then(function(data)
    {
      data.status = req.body.status;
      data.adviser = adviser;
      store.update({"_id":data._id},data, function(err,doc)
      {
        res.redirect(url_root+'/edit/claimant/'+data._id);
      });
    });
});

router.get(url_root+'/claimant/:id?/:page?/', function(req,res,next)
{
  var id = req.params.id;
  if (typeof id == "undefined") res.send('Need an id in the URL please!')

  var page = req.params.page;
  if (typeof page == "undefined") page = 'timeline';

  var store = db.get('customers');
  store.findOne({"_id":id}).then(function(data)
  {
    var timeline = JSON.parse(fs.readFileSync(__dirname + "/data-timeline.json").toString());
    var claims = JSON.parse(fs.readFileSync(__dirname + "/data-claims.json").toString());
    req.data = req.data || {};
    req.data.claimant = data;
    req.data.timeline = timeline;
    req.data.thispage = page;
    req.data.claim = _.sample(claims);
    req.url = url_root+'/claimant_'+page;
    next();
  });

  // json = JSON.parse(fs.readFileSync(__dirname + "/data-claimants.json").toString());
  // var data = _.filter(json, function(el) {
  //   return el.id == id;
  // });


});

router.get(url_root+'/db',function(req,res,next)
{
  // var stati = JSON.parse(fs.readFileSync(__dirname + "/data-stati.json").toString());

  var store = db.get('customers');
  store.find({}).then(function(err,docs)
  {
    var out = '<pre>';
    // out = util.inspect(stati,{depth:10})+"<br /><br />";
    _.each(docs,function(el,i)
    {
      /*
        Updating statuses.
      */
      // var w = el.status.waiting;
      // delete el.status.waiting;
      // el.status['awaiting'] = w;

      /*
        Updating the time fields.
      */
      // var now = moment();
      // var r = Math.ceil(Math.random()*2*7*24);
      // out += String(r) + "\n";
      // var time = now.subtract(r,'hours');
      // out += String(time) + "\n";
      // el.timet = time.format("x");
      // el.lastUpdated = time.format("dddd, MMMM Do YYYY, h:mm:ss a");
      // el.fromNow = time.fromNow();

      // output
      out += util.inspect(el,{depth:10})+"\n\n";

      store.update({"_id":el._id},el,function(err,doc)
      {
          // output
          out += util.inspect([err,doc],{depth:10})+"\n\n";
      });

    });
    out += '</pre>';
    res.send(out);
  });
});

/*
  One time only to transfer data from file into MongoDB
  Commented so it doesn't get hit accidentally again.
*/
// router.get(url_root+'/db',function(req,res,next)
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
