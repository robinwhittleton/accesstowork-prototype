var util =  require('util')
    _ =     require('underscore');

module.exports = {

    clear: function(req, res)
    {
        console.log("Clearing all user values.")
        for (cookie in req.cookies)
        {
            if (req.cookies.hasOwnProperty(cookie))
            {
                res.clearCookie(cookie);
            }
        }
    },

    form_to_cookie: function()
    {
        console.log('SAVING - form_to_cookie');
        return function(req, res, next)
        {
            if (req.method == "POST")
            {
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
