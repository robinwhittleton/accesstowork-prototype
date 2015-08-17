var util = require('util')

module.exports = {
    
    clear: function(req, res)
    {
        console.log("Destroying session.");
        req.session.destroy(function(err) {
            console.log('cleared session');
             // cannot access session here
        })
        console.log("Clearing all user values.")
        for (cookie in req.cookies)
        {
            if (req.cookies.hasOwnProperty(cookie))
            {
                res.clearCookie(cookie);
            }
        }
    },

    form_to_cookie: function(presenters)
    {
        return function(req, res, next)
        {
            if (req.method == "POST")
            {
                for (key in req.body)
                {
                    if (req.body.hasOwnProperty(key) && req.body[key])
                    {
                        var raw_value = req.body[key]
                        var value = presenters[key] ? presenters[key](raw_value) : raw_value
                        if (typeof value == 'object') value = JSON.stringify(value);
                        res.cookie(key, value);
                    }
                }
            }
            next();
        }
    },

    form_to_session: function()
    {
        return function(req, res, next)
        {
            
            if (req.method == "POST")
            {
                var tmp = req.get('Referrer');
                var page = tmp.substring(tmp.lastIndexOf("/") + 1, tmp.length);
                // var page = req.path.substring(req.path.lastIndexOf("/") + 1, req.path.length);

                // If there formdata object doesn't exist, create it.
                if (!req.session.formdata) req.session.formdata = {};            

                // If there formdata object doesn't exist, create it.
                if (!req.session.formdata[page]) req.session.formdata[page] = [];            

                // Add the form data.
                req.session.formdata[page].push(req.body);

                // Show it to the console.
                console.log(req.session.formdata);
            }            
            next();
        }
    },
};