var csv         = require('csv'),
    fs          = require('fs'),
    _           = require('underscore'),
    db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url);
  
var applications = JSON.parse(fs.readFileSync(__dirname + "/privateBeta-apps2.json").toString());
var customers = JSON.parse(fs.readFileSync(__dirname + "/customers.json").toString());
var wraiths = JSON.parse(fs.readFileSync(__dirname + "/tom_wraith_data.json").toString());

var max = Math.max(applications.length,customers.length);

console.log(wraiths); 

process.exit();
