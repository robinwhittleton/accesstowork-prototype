var csv         = require('csv'),
    fs          = require('fs'),
    _           = require('underscore');

if (typeof process.argv[2] != 'undefined') // make sure they've passed a file.
{
  var file = process.argv[2];
  var oupt = file.substr(0, file.lastIndexOf(".")) + ".json";
  var fish = fs.readFileSync(file);
  var newd = [];
  var c=0;
  csv.parse(fish, {"columns":true}, function(err,data)
  {
    _.each(data,function(el,i)
    {      
      var body = el['Body'];
      var curl = body.substr(body.lastIndexOf('-d')); 
      var tidy = curl.substring(4,curl.indexOf('}')+1)
                      .replace(/\\"/g,'"')                      
                      .replace(/\r\n/g,"");
      try {
        var json = JSON.parse(tidy);
        newd.push(json);
        c++;
      } catch (e) {
        console.log("---------------------------"+i+"---------------------------"); 
        console.log(tidy); 
      } 
    });
    fs.writeFileSync(__dirname + "/"+oupt, JSON.stringify(newd));
    console.log(c); 
  });
} else {
  console.log("Please tell me which CSV file you want me to use.");
}
