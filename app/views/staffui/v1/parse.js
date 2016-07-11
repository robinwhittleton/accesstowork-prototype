var csv = require('csv')
    fs  = require('fs');

var fish = fs.readFileSync('fish.csv');
csv.parse(fish, {"columns":true}, function(err,data)
{
  fs.writeFileSync(__dirname + "/data-claims.json", JSON.stringify(data));
});
