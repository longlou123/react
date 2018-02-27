var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var twoIndex = require('./routes/twoIndex');

var app = express();
//解决跨域问题
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("X-Powered-By",' 3.2.1')
    if (req.method == 'OPTIONS') {
    	res.send(200); /让options请求快速返回/
	  }
	  else {
	    next();
	  }
    //next();
});
app.use(bodyParser.json({limit: '1mb'}));  //这里指定参数使用 json 格式
app.use(bodyParser.urlencoded({
  extended: true
}));
//加载swig模块
var swig = require("swig");

// view engine setup
//定义应用使用的模板引擎
//第一个参数：所要渲染模板文件的后缀，也是模板引擎的名称，第二个参数：渲染的方法
app.engine("html",swig.renderFile);//(会默认缓存页面数据)
//定义模板文件存放的路径
//第一个参数必须是views，这是模块内指定的解析字段，第二个参数为路径：./表示根目录
app.set("views","./views");

//注册使用模板引擎；第一个参数不能变，第二个参数和上面的html一致
app.set("view engine","jade");

//在开发过程中要取消模板缓存，便于调试-----------------------------------------
swig.setDefaults({cache : false});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
//console.log(req.body);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
