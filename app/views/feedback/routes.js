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

  /*  removing those who don't have a
      satisfaction rating (i.e. the string
      isn't long enough) */
  var data = _.filter(json, function(el)
  {
    return el.RATING.length > 5;
  });

  /*  If number has gone too high reset it
      and start the loop again. */
  if (number >= data.length) number = 0;

  /* Group by rating to get totals. */
  var totals = _.groupBy(data,function(el)
  {
    return el.RATING.toLowerCase().trim();
  });

  /* Pass all this data to the template. */
  req.data = req.data || {};
  req.data.feedback = data[number];
  req.data.totals = {
    total: data.length,
    satisfied: Math.round(100 * totals['satisfied'].length / data.length),
    neither: Math.round(100 * totals['neither satisfied nor dissatisfied'].length / data.length),
    dissatisfied: Math.round(100 * totals['dissatisfied'].length / data.length)
  };
  req.data.number = number;
  req.url = '/feedback/';
  next();
});

module.exports = router;
