var fs          = require('fs'),
    _           = require('underscore');

var ads = JSON.parse(fs.readFileSync(__dirname + "/advisers.json").toString());

for (var i = 0; i < ads.length; i++) {
  ads[i].id = i;
}

fs.writeFileSync(__dirname + "/advisers.json", JSON.stringify(ads));
