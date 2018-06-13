var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var api = module.exports = express();
var proxyWeb = require('express-http-proxy');
var _ = require('lodash');
var compression = require('compression');
var fs = require('fs');
var multer = require('multer');
var path = require('path');
api.use(logger('dev'));
api.use(compression());
api.use('/api/', bodyParser.json({ "limit": "100000kb" })); // for parsing application/json
api.use('/api/', bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// 测试服务器地址 http://jzwap.uat1.rs.com/api-jiazhuang => http://api-jiazhuang.uat1.rs.com
var url = 'http://api-jiazhuang.dev.rs.com';
var urlPre = '/';
//var devEnv = 'prd';//切换开发环境
//var devEnv = 'dev';//切换开发环境
var devEnv = 'uat1';//切换开发环境
// var devEnv = 'stg';//切换开发环境

var baseUrl = {
  dev: {
    jiazhuang: 'http://api-jiazhuang.dev.rs.com',
    bigdata: 'http://bigdata.dev.rs.com',
    user: 'http://api-user.dev.rs.com',
    longyan: 'http://m.dev.rs.com',
    alibi: 'http://alibi.dev.rs.com',
    search: 'http://search.dev.rs.com',
    coupon: 'http://api-promotion.dev.rs.com/',
    rtapi: 'http://rtapi.dev.rs.com/',
    orderapi: 'http://api-order.dev.rs.com',
  },
  uat1: {
    jiazhuang: 'http://api-jiazhuang.uat1.rs.com',
    bigdata: 'http://bigdata.uat1.rs.com',
    user: 'http://api-user.uat1.rs.com',
    longyan: 'http://m.uat1.rs.com',
    alibi: 'http://alibi.uat1.rs.com',
    search: 'http://search.uat1.rs.com',
    coupon: 'http://api-promotion.uat1.rs.com/',
    rtapi: 'http://rtapi.uat1.rs.com/',
    orderapi: 'http://api-order.uat1.rs.com',
  },
  stg: {
    jiazhuang: 'https://api-jiazhuang.mklmall.com',
    bigdata: 'https://api-bigdata.mklmall.com',
    user: 'https://api-user.mklmall.com',
    longyan: 'https://m.mklmall.com',
    alibi: 'http://alibi.mklmall.com',
    // search:'https://search.mklmall.com',大数据因为stg没有数据，因此调用线上数据在stg做测试
    search: 'https://search.mmall.com',
    coupon: 'https://api-promotion.mklmall.com/',
    rtapi: 'https://rtapi.mklmall.com/',
    orderapi: 'https://api-order.mklmall.rs.com',
  },
  prd: {
    jiazhuang: 'https://api-jiazhuang.mmall.com',
    bigdata: 'https://api-bigdata.mmall.com',
    user: 'https://api-user.mmall.com',
    longyan: 'https://m.mmall.com',
    alibi: 'http://alibi.mmall.com',
    search: 'https://search.mmall.com',
    coupon: 'https://api-promotion.mmall.com/',
    rtapi: 'https://rtapi.mmall.com/',
    orderapi: 'https://api-order.mmall.rs.com',
  }
};
var jiazhuang = baseUrl[devEnv].jiazhuang;//普通接口域名
var bigdata = baseUrl[devEnv].bigdata;//普通接口域名
var user = baseUrl[devEnv].user;//普通接口域名
var longyan = baseUrl[devEnv].longyan;//普通接口域名
var alibi = baseUrl[devEnv].alibi;//普通接口域名
var search = baseUrl[devEnv].search;//普通接口域名
var coupon = baseUrl[devEnv].coupon;
var rtapi = baseUrl[devEnv].rtapi;//张文亮
var orderapi = baseUrl[devEnv].orderapi;


//require('./articleDetail/routes')(api);
// require('./buildingSites/routes')(api);
// require('./order/routes')(api);

api.use('/api-jiazhuang/**', proxyWeb(jiazhuang, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-jiazhuang', '');
    console.log('jiazhuang url', url);
    return url;
  }
}));

api.use('/api-longyan/**', proxyWeb(longyan, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-longyan', '');
    console.log('longyan url', longyan, url);
    return url;
  }
}));

api.use('/api-alibi/**', proxyWeb(alibi, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-alibi', '');
    console.log('alibi url', alibi, url);
    return url;
  }
}));

api.use('/api-search/**', proxyWeb(search, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-search', '');
    console.log('search url', search, url);
    return url;
  }
}));

api.use('/api-user/**', proxyWeb(user, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-user', '');
    console.log('user url', user, url);
    return url;
  }
}));

api.use('/api-bigdata/**', proxyWeb(bigdata, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-bigdata', '');
    console.log('bigdata url', bigdata, url);
    return url;
  }
}));

api.use('/api-coupon/**', proxyWeb(coupon, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-coupon', '');
    console.log('coupon url', coupon, url);
    return url;
  }
}));

api.use('/api/**', proxyWeb(url, {
  forwardPath: function (req, res) {
    var url = urlPre + req.originalUrl.replace('/api', '/api');
    console.log('req.originalUrl:', req.originalUrl);
    console.log('api url', url);
    return url;
  }

}));

api.use('/api-rtapi/**', proxyWeb(rtapi, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-rtapi', '');
    console.log('rtapi url', req.originalUrl, rtapi, url);
    return url;
  }
}));

api.use('/api-order/**', proxyWeb(orderapi, {
  forwardPath: function (req, res) {
    var url = req.originalUrl.replace('/api-order', '');
    console.log('orderapi url', req.originalUrl, orderapi, url);
    return url;
  }
}));
module.exports = api;



