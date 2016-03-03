var express     = require('express'),
    fs          = require("fs"),
    _           = require("underscore"),
    moment      = require('moment');
    router      = express.Router();

router.get('/offer/offer', function(req,res,next)
{
  req.data = req.data || {};
  req.data.user = req.session.user;
  next();
});

router.get(/\/offer\/offer*/, function(req,res,next)
{
  req.data = req.data || {};
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
  next();
});

module.exports = router;
