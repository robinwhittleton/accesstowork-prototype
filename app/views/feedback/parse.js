var csv = require('csv')
    fs  = require('fs')
    _   = require('underscore');

var existing = JSON.parse(fs.readFileSync('feedback.json'));

var sorted = _.countBy(existing,function(el)
{
  return el.RATING.toLowerCase().trim().split(' ')[0];
});

console.log(sorted)

// for (var i = 0; i < existing.length; i++) {
//   var e = existing[i];
//   console.log(i,e.DATE);
// }

// if (typeof process.argv[2] != 'undefined') // make sure they've passed a file.
// {
//   var file = process.argv[2];
//   var fish = fs.readFileSync(file);
//   csv.parse(fish, {"columns":true}, function(err,data)
//   {
//     for (var i = 0; i < data.length; i++) {
//       var d = data[i];
//       var rating = d['Feedback rating'].replace(/=+/,'').trim();
//       var feedback = d['feedback'].trim();
//       var m = d['Body'].match(/Submitted date : \'(.*)\'/);
//       var date = m[1].split(' ')[0];
//       
//       var newdata = {
//         RATING: rating,
//         FEEDBACK: feedback,
//         DATE: date
//       }
//       
//       existing.push(newdata);
//     }
//     
//     fs.writeFileSync(__dirname + "/feedback.json", JSON.stringify(existing));
//   });
// } else {
//   console.log("Please tell me which CSV file you want me to use.");
// }
