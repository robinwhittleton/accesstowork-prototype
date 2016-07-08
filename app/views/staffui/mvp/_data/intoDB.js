var fs          = require('fs'),
    _           = require('underscore'),
    // db_url      = process.env.MONGOLAB_URI || 'mongodb://localhost/accesstowork',
    db_url      = 'mongodb://localhost/accesstowork',
    db          = require('monk')(db_url);

var cases = JSON.parse(fs.readFileSync(__dirname + "/new_customers.json").toString());
var store = db.get('cases');

// console.log(cases); 

store.drop();
store.insert(cases);

// for (var i = 0; i < cases.length; i++) {
//   delete(cases[i].id);
//   store.insert(cases[i]);
// }

// store.insert(cases,function(err,doc)
// {
//     if (err) throw err;
//     console.log('doc: ' + JSON.stringify(doc));
// });

// console.log(store); 
// 
// for (var i = 0; i < cases.length; i++) {
//   // console.log(cases[i]); 
//   delete(cases[i].id);
//   try {
//     var r = store.insert(cases[i]);
//   } catch(e) {
//     console.log(e); 
//   }
//   // console.log(r); 
// }
