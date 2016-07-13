var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    merge       = require("merge"),
    _           = require("underscore"),
    moment      = require('moment'),
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    // db_url      = 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url),
    tog         = require(__dirname+'/../../../lib/tog.js'),
    router      = express.Router();

router.get('/offer/list', function(req,res,next)
{
  var store = db.get('user');
  store.find({},{sort:{"date":-1}},function(err,docs)
  {
    var data = _.map(docs,function(el)
    {
      return {
        id: el._id,
        start: el.start,
        date: moment(el.date).fromNow(),
      }
    });
    req.data = req.data || {};
    req.data.users = data;
    next();
  });
});

var getSingleApplication = function(req,res,next,url)
{
  var id = req.params.id, data;
  var store = db.get('user');
  // check whether an id has been passed
  if (typeof id == "undefined")
  {
    // if not - grab the latest application
    store.find({},{sort:{"date":-1}},function(err,docs)
    {
      data = docs[0];
      compete();
    });
  } else {
    // if so - grab the correct application
    store.findById(id, function(err,doc)
    {
      data = doc;
      compete();
    });
  }
  /*
    Finishing function to call in the callbacks above.
  */
  var compete = function() {
    req.data = req.data || {};
    req.data.user = data;
    req.data.dump = tog(data);
    req.url = url;
    next();
  }
}

router.get('/offer/offer/:id?', function(req,res,next)
{
  getSingleApplication(req,res,next,'/offer/offer/');
});

router.get('/offer/mvp/letter/:id?', function(req,res,next)
{
  getSingleApplication(req,res,next,'/offer/mvp/letter/');
});

router.get('/offer/create/:id?', function(req,res,next)
{
  getSingleApplication(req,res,next,'/offer/create/');
});

router.post('/offer/create', function(req,res,next)
{
  var store = db.get('user');
  var _id = store.id(req.body._id);
  delete req.body._id;

  store.findById(_id, function(err,doc)
  {
    var newdata = merge(doc, {"offers":req.body} );
    store.updateById(_id, newdata, function(err,id)
    {
      req.data = req.data || {};
      req.data.user = newdata;
      req.url = '/offer/create/'+_id;
      next();
    });
  });
});

module.exports = router;
