var csv         = require('csv'),
    fs          = require('fs'),
    merge       = require('merge'),
    _           = require('underscore');

var alloc = ['deaf','hidden','large','self','director','visual','unknown'];
var customers = JSON.parse(fs.readFileSync(__dirname + "/customers.json").toString());  
var advisers = JSON.parse(fs.readFileSync(__dirname + "/advisers.json").toString());  
var wraiths = JSON.parse(fs.readFileSync(__dirname + "/tom_wraith_data.json").toString());
var newd = [];
var c=1;
while(customers.length > 0) 
{
  var customer = customers.splice(Math.floor(Math.random()*customers.length),1);
  var wraith = wraiths.pop();
  var w = wraith['_source'];
  var a = alloc[Math.floor(Math.random()*alloc.length)];
  var a_num = Math.floor(Math.random()*advisers.length);
  var adviser = advisers[a_num];
  adviser.id = a_num;
  
  var open = (Math.random() > 0.8);
  
  if (w.how_harder_job) w.job_how_harder = w.how_harder_job;
  if (w.what_need) w.job_what_need = w.what_need;
  if (w['Submission date']) w.postDate = w['Submission date'];
  
  var o = merge(customer[0],w,
    {
      id:wraith['_id'],
      "allocation":a,
      "adviser":adviser,
      "open":open
    });
  newd.push(o);
  console.log(c++); 
}

newd = _.sortBy(newd,"postDate").reverse();

fs.writeFileSync(__dirname + "/new_customers.json", JSON.stringify(newd));
process.exit();
