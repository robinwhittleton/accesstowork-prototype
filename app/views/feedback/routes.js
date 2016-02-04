var express     = require('express'),
    fs          = require("fs"),
    _           = require("underscore"),
    moment      = require('moment');
    router      = express.Router();

router.get('/feedback/', function(req,res,next)
{
  json = JSON.parse(fs.readFileSync(__dirname + "/feedback.json").toString());
  var data = _.filter(json, function(el)
  {
    return el.RATING.length > 5;
  });
  req.data.feedback = data;
  next();
});

module.exports = router;
