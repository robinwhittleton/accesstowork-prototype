var fs      = require('fs'),
    _       = require('underscore'),

var advisers = JSON.parse(fs.readFileSync(__dirname + "/advisers.json").toString());

_.each(advisers,function(el,i,array)
{
  el.id = i;
  delete el.region;
  delete el.gender;
});

fs.writeFileSync(__dirname + "/advisers.json", JSON.stringify(advisers));