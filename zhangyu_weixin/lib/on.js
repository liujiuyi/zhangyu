"use strict";

var config = require('../config.json');
var logger = require('log4js').getLogger('lib/on.js');

var account_dao = require('../dao/account_dao');
var wxservice = require('../lib/wxservice');

var request = require('request');
var util = require('util');
var path = require('path');
var fs = require("fs");

var nwUser = require('node-weixin-user');
var nwSettings = require('node-weixin-settings');

var app = config.app;
// Start
var On = function() {
};
// 
On.prototype = {
  onUnsubscribe : function(openid, cb) {
    if (cb)
      cb(null);
  },

  onSubscribe : function(openid, cb) {
    var self = this;
    account_dao.createAccount(openid, function(err, oldAccount, results,
        account) {
      var user_id = account.user_id;
      var num=""; 
      for(var i=0;i<6;i++) 
      { 
        num+=Math.floor(Math.random()*10); 
      } 
      var user_name = num + user_id;
      // 获取用户信息
      self.profile(openid, cb, user_name);
    });
  },

  profile : function(openid, cb, user_name) {
    nwUser.profile(nwSettings, app, openid, function(err, data) {
      if (data.errcode > 0)
        err = data.errcode;
      if (err) {
        logger.debug('err %s', err);
        logger.debug('data %s', JSON.stringify(data));
        if (cb)
          cb(data.errcode, data.errmsg);
      } else {
        account_dao.updateAccount(data.openid, {
          user_name : user_name,
          email : data.openid + "@null.null",
          headimgurl : data.headimgurl,
          sex : data.sex
        }, function(err, results, account) {
          if (cb)
            cb(err, account);
        });
      }
    });

  },

  onMyQrcode : function(openid) {
    // gen qrcode
    var nwLink = require('node-weixin-link');
    var nwMedia = require('node-weixin-media');
    nwLink.qrcode.permanent.createString(nwSettings, app, openid, function(err,
        json) {
      if (err) {
        logger.info(err);
      } else {
        var qr_url = util.format(
            'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=%s',
            json.ticket);
        logger.info('qrcode.permanent url: %s', qr_url);
        var qr = path.join(config.tmpdir, openid + '_qr.jpg');
        var qr_file = fs.createWriteStream(qr);

        request(qr_url).pipe(qr_file);
        
        qr_file.on('finish', function() {
          nwMedia.permanent.create(nwSettings, app, 'image', qr, function(error, json) {
            if (err) {
              logger.info(err);
            } else {
              logger.info('permanent media_id: %s', json.media_id);
              wxservice.image(openid, json.media_id, function(err, data) {
                logger.info('service send image');
              });
            }
          });
        });
      }
    });
  }
};

module.exports = new On();
