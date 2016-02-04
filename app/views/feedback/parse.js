var csv = require('csv')
    fs  = require('fs');

var fish = fs.readFileSync('feedback.csv');
csv.parse(fish, {"columns":true}, function(err,data)
{
  fs.writeFileSync(__dirname + "/feedback.json", JSON.stringify(data));
});
