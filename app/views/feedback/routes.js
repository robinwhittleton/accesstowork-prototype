var express     = require('express'),
    fs          = require("fs"),
    _           = require("underscore"),
    moment      = require('moment');
    router      = express.Router();

router.get('/feedback/:number?', function(req,res,next)
{
  var number = req.params.number;
  if (!number) number = 0;

  json = JSON.parse(fs.readFileSync(__dirname + "/feedback.json").toString());
  var data = _.filter(json, function(el)
  {
    return el.RATING.length > 5;
  });

  if (number >= data.length) number = 0;

  req.data.feedback = data[number];
  req.data.total = data.length;
  req.data.number = number;
  req.url = '/feedback/';
  next();
});

module.exports = router;
