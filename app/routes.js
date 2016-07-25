var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    merge       = require("merge"),
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url),
    versions    = require(__dirname + '/../lib/versions.js'),
    user_data   = require(__dirname + '/../lib/user_data.js'),
    router      = express.Router();

/*
  Special route for the index page.
*/
router.get('/', function (req, res) {
  res.render('index', versions);
});

/*
  Dump session data so I can see it.
*/
router.get('/session',function(req, res)
{
  res.send("<pre>"+util.inspect(req.session,{depth:10})+"</pre>");
});

/*
  Dumping out the database for debugging.
*/
router.get('/db',function(req, res, next)
{
  var store = db.get('user');
  store.find({},{sort:{"date":-1}},function(err,docs)
  {
    var d = [];
    for (var i = 0; i < docs.length; i++) {
      d.push(new Date(docs[i].date));
    }
    res.send("<pre>"+util.inspect(docs[0],{depth:10})+"</pre>");
  });
});

/*
  Removing all the cookies.
*/
router.get('/reset', function(req, res)
{
  user_data.clear(req, res);
  res.redirect('/');
});

module.exports = router;
