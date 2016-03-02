var util    = require('util')
       _    = require('underscore');

module.exports = {

  clear: function(req, res)
  {
    console.log("Clearing all user values.")
    req.session.destroy();
    for (cookie in req.cookies)
    {
      if (req.cookies.hasOwnProperty(cookie))
      {
          res.clearCookie(cookie);
      }
    }
  },

  save_input_data: function()
  {
    return function(req, res, next)
    {
      // console.log('SAVING - save_input_data');
      // console.log('- - - session.user');
      // console.log(req.session.user);
      // console.log('- - - session.test');
      // console.log(req.session.test);

      if (req.method == "POST")
      {
        var page = req.body.page_name;
        delete req.body.page_name;

        var n = req.body.multiple;

        req.session.user = req.session.user || {};

        if (typeof n == 'undefined') req.session.user[page] = req.body;
        else {
            delete req.body.multiple;
            req.session.user[page] = req.session.user[page] || [];
            req.session.user[page][parseInt(n)] = req.body;
        }

        console.log(req.session.user[page]);

        for (key in req.body)
        {
          if (req.body.hasOwnProperty(key) && req.body[key])
          {
            var raw_value = req.body[key];
            var value = raw_value;
            key = key.replace(/-/g,'_');
            // if it's an array remove empty values
            if (_.isArray(value)) value = _.compact(value);
            // always store as JSON
            value = JSON.stringify(value);
            // stick it in the cookie
            res.cookie(key, value);
          }
        }
      }
      next();
    }
  }
};

// router.get('/mon/',function(req, res, next)
// {
//   var foo = db.get('foo');
//   foo.find({},function(err,docs)
//   {
//     console.log("first");
//     console.log(docs);
//     res.send(util.inspect(docs)+'<form action="/mon/" method="post"><button class="button">Continue</button></form>')
//   });
// });
//
// router.post('/mon/',function(req, res, next)
// {
//   var foo = db.get('foo');
//   foo.insert({name:"Chimp",surname:"Morgan",wobble:[
//     "polly","pilly",'pally'
//   ]});
//   res.redirect('/mon/');
// });
