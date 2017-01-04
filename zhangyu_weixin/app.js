"use strict";
// //set DEBUG=handle & node .\bin\www
var config = require('./config.json');

var logger = require('log4js').getLogger('app.js');

var express = require('express');
var app = express();

var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicons = require('connect-favicons');

var hbs = require("hbs");
hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerHelper("equal", require("handlebars-helper-equal"));
hbs.localsAsTemplateData(app);
// {{blocks}} {{extend}}
var blocks = {};
hbs.registerHelper('extend', function(name, context) {
  var block = blocks[name];
  if (!block) {
    block = blocks[name] = [];
  }

  block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
  var val = (blocks[name] || []).join('\n');

  // clear the block
  blocks[name] = [];
  return val;
});
hbs.registerHelper('json', function(val) {
  return JSON.stringify(val);
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(favicons(__dirname + '/public/img/icons'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  logger.info('\n----------- New Request ---------\nurl: %s\nquery: %s\nbody: %s\n--------------------------------- ', req.originalUrl, JSON.stringify(req.query), JSON.stringify(req.body));
  next();
});

var weixin_routes = require('./routes/weixin');
app.use(config.appname + '/weixin', weixin_routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('error', {
    message : err.message,
    error : {}
  });
});

app.use(function(err, req, res, next) {
  logger.error(err);
  res.status(err.status || 500);
  res.render('error', {
    message : err.message || err,
    error : {}
  });
});

module.exports = app;
