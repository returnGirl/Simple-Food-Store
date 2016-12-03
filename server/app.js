var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var compression = require('compression');
var logger = require('./utils/logger');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var session = require('express-session')

module.exports = function (db) {
  let ctrl = require('./control/index')(db);

  setConnection();

  setLogRouter(ctrl);

  setPublicRouter();

  setAuthRouter();

  setModelRouter(ctrl);

  setErrorHandle();

  return app;
}

function setPublicRouter() {
  
  app.get('/', function(req, res) {
    console.log(__dirname);
    let dir = '../public/views/all-foods.html';
    res.sendFile(path.join(__dirname, dir));
  });

  app.get('/login', function(req, res) {
    console.log(__dirname);
    let dir = '../public/views/login-register.html';
    res.sendFile(path.join(__dirname, dir));
  });
}

function setAuthRouter() {
  app.get('/*', function(req, res, next) {
    if ((req.path.indexOf('/api') == -1) && !req.session.user) {
      res.redirect('/login');
    } else {
      next();
    }
  })
}

function setConnection() {
  // 设置中间件
  app.use(compression());

  app.use(express.static(path.join(__dirname, '../public')));

  app.use(function (req, res, next){
    logger.info(`${req.method} : ${req.url}`);
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(session({ secret: 'Simple Food Store For pml', cookie: { maxAge: 60000 }}))
}

function setLogRouter(ctrl) {
  app.post('/login', ctrl.login);
  app.post('/logout', ctrl.logout);
}

function setModelRouter(ctrl) {
  // create model router

  let firstUpperCase = function (str) {
    return str.toString()[0].toUpperCase() + str.toString().slice(1);
  }

  let models = ['user', 'food', 'order'];

  models.forEach((model)=>{
    app.get('/api/' + model, ctrl['find' + firstUpperCase(model)]);
    app.post('/api/' + model, ctrl['create' + firstUpperCase(model)]);
  })
}

function setErrorHandle() {

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {

    res.status(err.status || 500);
    res.end('error HTML');
  });
}

