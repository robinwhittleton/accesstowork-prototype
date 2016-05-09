var csv = require('csv')
    fs  = require('fs');


if (typeof process.argv[2] != 'undefined') // make sure they've passed a file.
{
  var file = process.argv[2];
  var fish = fs.readFileSync(file);
  csv.parse(fish, {"columns":true}, function(err,data)
  {
    fs.writeFileSync(__dirname + "/feedback.json", JSON.stringify(data));
  });
} else {
  console.log("Please tell me which CSV file you want me to use.");
}
