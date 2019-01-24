var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var workRouter = require('./routes/work');
var blogRouter = require('./routes/blog');

var THREE = require('three');
var jquery = require('jquery');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// So /jquery is the mounting point of the /node_modules/jquery/dist/ directory.
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

// So /three/build is the mounting point of the /node_modules/three/build/ directory.
app.use('/three/build', express.static(__dirname + '/node_modules/three/build/'));

// So /three/js is the mounting point of the /node_modules/three/examples/js/ directory.
app.use('/three/js', express.static(__dirname + '/node_modules/three/examples/js/'));

// So /three/textures is the mounting point of the /node_modules/three/src/textures/ directory.
app.use('/three/textures', express.static(__dirname + '/node_modules/three/src/textures/'));

// So /three/textures is the mounting point of the /node_modules/three/src/textures/ directory.
app.use('/three/core', express.static(__dirname + '/node_modules/three/src/core/'));

// So /three/textures is the mounting point of the /node_modules/three/src/textures/ directory.
app.use('/three/extras', express.static(__dirname + '/node_modules/three/src/extras/'));

// So /three/textures is the mounting point of the /node_modules/three/src/textures/ directory.
app.use('/three/src', express.static(__dirname + '/node_modules/three/src/'));

// So /three/js is the mounting point of the /node_modules/three/examples/js/ directory.
app.use('/three/js/postprocessing', express.static(__dirname + '/node_modules/three/examples/js/postprocessing/'));
// So /three/js is the mounting point of the /node_modules/three/examples/js/ directory.
app.use('/three/js/utils', express.static(__dirname + '/node_modules/three/examples/js/utils/'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/work', workRouter);
app.use('/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
