var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    merge       = require("merge"),
    _           = require("underscore"),
    moment      = require('moment');
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url),
    router      = express.Router();

router.get('/offer/offer', function(req,res,next)
{
  // req.data = req.data || {};
  // req.data.user = req.session.user;
  var store = db.get('user');
  store.find({},{sort:{"date":-1}},function(err,docs)
  {
    req.data = req.data || {};
    req.data.user = docs[0];
    // res.send("<pre>"+util.inspect(docs[0],{depth:10})+"</pre>");
    next();
  });
});

router.get('/offer/create', function(req,res,next)
{
  var store = db.get('user');
  store.find({},{sort:{"date":-1}},function(err,docs)
  {
    req.data = req.data || {};
    req.data.user = docs[0];
    next();
    // res.send("<pre>"+util.inspect(docs[0],{depth:10})+"</pre>");
  });
});

router.post('/offer/create', function(req,res,next)
{
  var store = db.get('user');
  var id = store.id(req.body._id);
  delete req.body._id;

  store.findById(id, function(err,doc)
  {
    var newdata = merge(doc, {"offers":req.body} );
    store.updateById(id, newdata, function(err,id)
    {
      req.data = req.data || {};
      req.data.user = newdata;
      // res.send("<pre>"+util.inspect(newdata,{depth:10})+"</pre>");
      next();
    });
  });
});

module.exports = router;
