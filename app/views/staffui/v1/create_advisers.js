var fs      = require('fs'),
    _       = require('underscore'),

/*
  This takes the output of http://uinames.com/api/ and just removes the
  region and gender attributes to leave the names intact.

  After this has been run once it's probably never needed again, but
  I'll keep it here in case I ever want to download a load more.
*/
var advisers = JSON.parse(fs.readFileSync(__dirname + "/data-advisers.json").toString());

_.each(advisers,function(el,i,array)
{
  el.id = i;
  delete el.region;
  delete el.gender;
});

fs.writeFileSync(__dirname + "/data-advisers.json", JSON.stringify(advisers));
