var express     = require('express'),
    fs          = require("fs"),
    _           = require("underscore"),
    moment      = require('moment');
    router      = express.Router();

router.get('/offer/offer', function(req,res,next)
{
  console.log(req.session);
  req.data.user = req.session.user;
  next();
});

module.exports = router;
