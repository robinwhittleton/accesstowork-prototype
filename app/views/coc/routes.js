var express     = require('express'),
    fs          = require("fs"),
    util        = require("util"),
    merge       = require("merge"),
    _           = require("underscore"),
    router      = express.Router();

router.get('/coca/:page', function(req,res,next)
{    
  if (req.session.user !== undefined
      && req.session.user.whatchanged !== undefined
      && req.session.user.whatchanged['what-changed'] !== undefined)
  {
    var wc = req.session.user.whatchanged['what-changed'];
    var page = req.params.page;

    // just set this so we know elsewhere.
    req.session.coc = true;
    
    // check whether they'd ticked the relevant box and redirect appropriately.
    if (page == "start" && wc.indexOf("condition") < 0) {      
      res.redirect('/coca/aboutyou');
    } else if (page == "aboutyou" && wc.indexOf("nameaddress") < 0) {
      res.redirect('/coca/contactyou');
    } else if (page == "contactyou" && wc.indexOf("contact") < 0) {
      res.redirect('/coca/coc_other');
    } else if (page == "declaration" && wc.indexOf("other") > 0) { // nb this is to pick up if other WAS chosen
      res.redirect('/coca/coc_other');
    } else if (page == "other" && wc.indexOf("other") < 0) {
      res.redirect('/coca/coc_declaration');
    }
    
    // make use of the default application pages where possible.
    req.url = '/application/'+page+'/';
    next();
    
  } else {
    // if no data they must have ticked nothing.
    res.redirect('/coc/nochange')
  }
});

module.exports = router;
