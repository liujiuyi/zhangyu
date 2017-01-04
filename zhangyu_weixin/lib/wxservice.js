var config = require('../config.json');
var logger = require('log4js').getLogger('lib/wxservice.js');

var nwAuth = require('node-weixin-auth');

var EVENT_WEIXIN_API_RESULT = 'weixin_api_result';
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
event.on(EVENT_WEIXIN_API_RESULT, function(errcode, errmsg, var1, var2) {
  logger.info("%s, %s, %s, %s", errcode, errmsg, var1, var2);
  switch (errcode) {
  case 40001 :
    nwAuth.determine(this.app, function() {
      done();
    });
    break;
  default :
    //
  }
});

var nwMessage = require('node-weixin-message');
//
var WxService = function(app) {
  this.app = app;
  this.service = nwMessage.service;
  this.template = nwMessage.template;

};
// 创建用户
WxService.prototype = {
  text : function( openid, msg, callback) {
    logger.info("text: %s, %s", openid, msg);
    this.service.api.text(this.app, openid, msg, function(err, data) {
      event.emit(EVENT_WEIXIN_API_RESULT, data.errcode, data.errmsg);
      callback(err, data);
    });
  },
  image : function( openid, mediaId, callback) {
    logger.info("image: %s, %s", openid, mediaId);
    this.service.api.image(this.app, openid, mediaId, function(err, data) {
      event.emit(EVENT_WEIXIN_API_RESULT, data.errcode, data.errmsg);
      callback(err, data);
    });
  },
  wxcard : function(openid, cardId, outerId, callback) {
    logger.info("wxcard: %s, %s, %s", openid, cardId, outerId);
    this.service.api.wxcard(this.app, openid, cardId, outerId, function(err, data) {
      event.emit(EVENT_WEIXIN_API_RESULT, data.errcode, data.errmsg);
      callback(err, data);
    });
  },
  sendtemplate : function(openid, templateId, url, data, callback) {
    logger.info("sendtemplate: %s, %s, %s, %s", openid, templateId, url, data);
    this.template.send(this.app, openid, templateId, url, data, function(err, data) {
      event.emit(EVENT_WEIXIN_API_RESULT, data.errcode, data.errmsg);
      callback(err, data);
    });
  },
};

module.exports = new WxService(config.app);
