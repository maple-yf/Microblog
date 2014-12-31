var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/users');
var settings=require('./settings');
var db=require('./models/db');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var util=require('util');

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

//uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//session flash .......
app.use(session({ secret: "keyboard cat" }));//开启session
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());//put this after the session and cookie parser


//必须放到 app.use('/',routes)之前
app.use(function(req, res, next){
  console.log("app.usr local");
  res.locals.user = req.session.user;
  res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;

  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  
  //console.log(res.locals);
  next();
});

app.use('/', routes);
app.use('/users', users);

//cookie解析的中间件
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//提供session支持
app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.db,
    })
}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});




app.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');

module.exports = app;
