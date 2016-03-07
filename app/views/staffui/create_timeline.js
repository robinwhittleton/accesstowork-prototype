var fs      = require('fs'),
    _       = require('underscore'),
    moment  = require('moment');

var advisers = JSON.parse(fs.readFileSync(__dirname + "/data-advisers.json").toString());
var stati = JSON.parse(fs.readFileSync(__dirname + "/data-stati.json").toString());;

var lorum = [
  "Mauris congue varius lectus eget tempor.",
  "Vivamus eu sollicitudin arcu.",
  "Aliquam non dui dapibus, finibus nibh ut, dapibus ligula.",
  "Mauris fermentum ante sed nibh iaculis porta.",
  "Praesent hendrerit nunc eu nisi dapibus, quis aliquam augue varius.",
  "Vivamus pretium lacinia eros, eu sodales lectus semper eget."
];

var icons = [
  {"heading":"Automated notification", "icon":"bell.svg"},
  {"heading":"Change of circumstances", "icon":"cross.svg"},
  {"heading":"Status change", "icon":"doc.svg"},
  {"heading":"Information recieved", "icon":"down.svg"},
  {"heading":"Agreement receieved", "icon":"tick.svg"},
  {"heading":"Information requested", "icon":"up.svg"}
];

var timeline = [];

for(var i=0; i < 100; i++)
{
  var el = {};
  el.id = i;
  el.adviser = _.sample(advisers);
  el.body = _.shuffle(_.sample(lorum,Math.floor(Math.random()*lorum.length))).join(' ');
  console.log(el.body);
  el.heading = _.sample(icons).heading;
  el.icon = _.sample(icons).icon;
  el.status = _.sample(stati);
  timeline.push(el);

  var now = moment();
  var r = Math.floor(Math.random()*60*60);
  el.timet = now.subtract(r,'minute').format("x");
  el.fromNow = now.subtract(r,'minute').fromNow();
}

timeline = _.sortBy(timeline,'timet').reverse();

fs.writeFileSync(__dirname + "/data-timeline.json", JSON.stringify(timeline));
