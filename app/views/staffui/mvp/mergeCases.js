var csv         = require('csv'),
    fs          = require('fs'),
    merge       = require('merge'),
    _           = require('underscore');
  
var customers = JSON.parse(fs.readFileSync(__dirname + "/customers.json").toString());  
var wraiths = JSON.parse(fs.readFileSync(__dirname + "/tom_wraith_data.json").toString());
var newd = [];

while(customers.length > 0) 
{
  var customer = customers.splice(Math.floor(Math.random(customers.length)),1);
  var wraith = wraiths.pop();
  var w = wraith['_source'];
  
  if (w.how_harder_job) w.job_how_harder = w.how_harder_job;
  if (w.what_need) w.job_what_need = w.what_need;
  if (w['Submission date']) w.postDate = w['Submission date'];
  
  var o = merge(customer[0],w,{id:wraith['_id']});
  newd.push(o);
}

newd = _.sortBy(newd,"postDate").reverse();

fs.writeFileSync(__dirname + "/new_customers.json", JSON.stringify(newd));
process.exit();
