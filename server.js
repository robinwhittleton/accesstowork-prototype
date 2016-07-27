var path          = require('path'),
    express       = require('express'),
    browserSync   = require('browser-sync'),
    nunjucks      = require('express-nunjucks'),
    favicon       = require('serve-favicon'),
    basicAuth     = require('basic-auth-connect'),
    bodyParser    = require('body-parser'),
    cookieParser  = require('cookie-parser'),
    session       = require('express-session'),
    moment        = require('moment'),
    app           = express(),
    // Grab environment variables specified in Procfile or as Heroku config vars
    port          = process.env.PORT || 3000,
    username      = process.env.USERNAME,
    password      = process.env.PASSWORD,
    env           = process.env.NODE_ENV || 'development',
    sessionSecret = process.env.SESSION_SECRET || 'sessionsecret',
    user_data     = require(__dirname + '/lib/user_data.js'),
    routes        = require(__dirname + '/lib/default-routes.js');

global.appRoot = __dirname;

/*
  Authenticate against the environment-provided credentials,
  if running the app in production (Heroku, effectively)
*/
if (env === 'production') {
  if (!username || !password) {
    console.log('Username or password is not set, exiting.');
    process.exit(1);
  }
  app.use(basicAuth(username, password));
}

/*
  Setting up the templating system, nunjucks etc.
*/
app.set('view engine', 'html');
app.set('views', [__dirname + '/app/views/', __dirname + '/lib/']);
nunjucks.setup({
    autoescape: true,
    watch: true,
    noCache: true,
}, app, function(env)
{
  var nunjucksSafe = env.getFilter('safe');
  
  env.addFilter('slugify', function(str) {
      return str.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()’]/g,"").replace(/ +/g,'_').toLowerCase();
  });
  env.addFilter('check', function(str,checkee,output) {
      return str == checkee ? output : '';
  });
  env.addFilter('bool', function(str,yes,no) {
      return Boolean(str) ? yes : no ;
  });
  env.addFilter('classify', function(str,checkee,output) {
      return str.split(' ')[0].toLowerCase();
  });
  env.addFilter('sanssuffix', function(str) {
      return str.replace(".html","");
  });
  env.addFilter('arrayify', function(val) {
      if (typeof val == 'string') return [val];
      else return val;
  });
  env.addFilter('log', function log(a) {
  	return nunjucksSafe('<script>console.log(' + JSON.stringify(a, null, '\t') + ');</script>');
  });
  env.addFilter('makeDate', function(str) {
      var d = new Date(str);
      return d.toString();
  });
  env.addFilter('formatDate', function(str,format) {
      return moment(str).format(format);
  });
  env.addFilter('randarr', function(array) {
      return _.sample(array);
  });
  env.addFilter('randnum', function(str,low,high) {
      return low + Math.floor(Math.random()*(1+high-low));
  });
  env.addFilter('revCron', function(array) {
      return _.sortBy(array,"date").reverse();
  });
});


/*
  Middleware to serve static assets.
*/
app.use('/public', express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/govuk_modules/govuk_template/assets'));
app.use('/public', express.static(__dirname + '/govuk_modules/govuk_frontend_toolkit'));
app.use('/public/images/icons', express.static(__dirname + '/govuk_modules/govuk_frontend_toolkit/images'));
app.use(favicon(path.join(__dirname, 'govuk_modules', 'govuk_template', 'assets', 'images','favicon.ico')));


/*
  Support for parsing data in POSTs.
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
  secret: sessionSecret,
  cookie: { maxAge: 30 * 60 * 1000 },
  resave: true,
  saveUninitialized: true,
  rolling: true
}));
app.use(user_data.save_input_data());


/*
  Send assetPath to all views.
*/
app.use(function (req, res, next) {
  res.locals.asset_path="/public/";
  next();
});


/*
  Routers
*/
if (typeof(routes) != "function") {
  console.log(routes.bind);
  console.log("Warning: the use of bind in routes is deprecated - please check the prototype kit documentation for writing routes.")
  routes.bind(app);
} else {
  console.log('Using routes');
  app.use("/application", require(__dirname + '/app/views/application/routes.js'));    // these have to come first.
  app.use('/staffui/v1',  require(__dirname + '/app/views/staffui/v1/routes.js'));  // these have to come first.
  app.use('/staffui/v2',  require(__dirname + '/app/views/staffui/v2/routes.js'));  // these have to come first.
  app.use('/staffui/mvp', require(__dirname + '/app/views/staffui/mvp/routes.js'));  // these have to come first.
  app.use(require(__dirname + '/app/views/feedback/routes.js'));  // these have to come first.
  app.use(require(__dirname + '/app/views/offer/routes.js'));  // these have to come first.
  app.use(require(__dirname + '/app/views/coc/routes.js'));    // these have to come first.
  app.use(require(__dirname + '/app/legacy-routes.js'));    // these have to come first.
  app.use(require(__dirname + '/app/routes.js'));    // these have to come first.
  app.use(routes);        // these come last because they mop up!
}


/*
  Start the app.
  Use browserSync if we're in development.
*/
if (env === 'production') {
  app.listen(port);
} else {
  app.listen(port,function()
  {
    browserSync({
      proxy:'localhost:'+port,
      port:port+1,
      ui:false,
      files:['public/**/*.{js,css,png}','app/views/**/*.html'],
      ghostmode:{clicks:true, forms: true, scroll:true},
      open:false,
    });
  });
}

console.log('');
console.log('Listening on port ' + port);
console.log('');
