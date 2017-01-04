// 微信消息回调接口

var config = require('../config.json');
var logger = require('log4js').getLogger('routers/weixin.js');
var crypto = require('crypto');
var util = require('util');

var path = require('path');

var express = require('express');
var router = express.Router();

var x2j = require('xml2js');

var app = config.app;

var nwAuth = require('node-weixin-auth');
var nwMessage = require('node-weixin-message');
var reply = nwMessage.reply;

var on = require('../lib/on');
var wxservice = require('../lib/wxservice');
var account_dao = require('../dao/account_dao');

// Start
router.all('/getsignature', function(req, res, next) {
  var url = req.body.url;
  logger.info('url: %s', url);

  nwAuth.determine(app, function(err, authData) {
    if (err) {
      throw new Error(err);
    }
    var type = 'jsapi';
    nwAuth.ticket.determine(app, authData.accessToken, type, function(err,
        ticket) {
      if (err) {
        throw new Error(err);
      }
      var timestamp = String((new Date().getTime() / 1000).toFixed(0));
      var noncestr = crypto.createHash('sha1').update(timestamp).digest('hex');
      var str = 'jsapi_ticket=' + ticket.ticket + '&noncestr=' + noncestr
          + '&timestamp=' + timestamp + '&url=' + url;
      var signature = crypto.createHash('sha1').update(str).digest('hex');

      res.json({
        appId : config.app.id,
        timestamp : timestamp,
        nonceStr : noncestr,
        signature : signature
      });
    });
  });
});

router.get('/', function(req, res, next) {
  var signature = req.query.signature;
  var timestamp = req.query.timestamp;
  var nonce = req.query.nonce;
  var echostr = req.query.echostr;
  if (nwAuth.check(config.app.token, signature, timestamp, nonce)) {
    res.send(echostr);
  } else {
    res.send('invalid request');
  }

});

router.post('/', function(req, res, next) {
  var messages = nwMessage.messages;
  // 监听事件消息
  messages.event.on.subscribe(function(msg, res) {
    logger.info("subscribe received");
    logger.info(msg);
    var me = msg.ToUserName;
    var openid = msg.FromUserName;
    var text = reply.text(me, openid, "欢迎您关注章鱼电子商务公众平台");
    res.send(text);

    on.onSubscribe(openid, function(err) {
      account_dao.getByOpenid(openid,
          function(err, account) {
            // 确定代理店:代理点提供的qrcode，必须是xxx或xxx_xxxxx的格式
            if (!account.parent_admin_id
                && msg.EventKey.indexOf('qrscene_') === 0) {
              var data = msg.EventKey.substring(8).split('_');
              // 上级体验店
              var parent_id = data[0];
              account_dao.updateAccount(openid, {
                parent_id : parent_id
              }, function(err, results, account) {
              });
            }
          });
    });
  });
  messages.event.on.unsubscribe(function(msg, res) {
    res.send("success");
    logger.info("unsubscribe received");
    logger.info(msg);

    var openid = msg.FromUserName;
    on.onUnsubscribe(openid);
  });
  messages.event.on.scan(function(msg, res) {
    res.send("success");

    logger.info("scan received");
    logger.info(msg);
    var openid = msg.FromUserName;

    account_dao.getByOpenid(openid, function(err, account) {
      if (!account.parent_admin_id && msg.EventKey) {
        var data = msg.EventKey.split('_');
        // 上级体验店
        var parent_admin_id = data[0];
        account_dao.updateAccount(openid, {
          parent_admin_id : parent_admin_id
        }, function(err, results, account) {
        });
      }
    });
  });
  messages.event.on.click(function(msg, res) {
    logger.info("click received");
    logger.info(msg);
    var openid = msg.FromUserName;
    var me = msg.ToUserName;
    switch (msg.EventKey) {
    case 'my_qrcode':
      res.send("success");
      account_dao.getByOpenid(openid, function(err, account) {
        if (account.user_rank && account.user_rank >= 2) {
          var text = "请稍等，正在为您生成二维码...";
          wxservice.text(openid, text, function(err, data) {
          });
          on.onMyQrcode(openid);
        } else {
          var text = "请先进行商家注册，只有通过审核的商家才能拥有二维码";
          wxservice.text(openid, text, function(err, data) {
          });
        }
      });
      break;
    }
  });

  // 获取XML内容
  var xml = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    xml += chunk;
  });

  // 内容接收完毕
  req.on('end', function() {
    x2j.parseString(xml, {
      explicitArray : false,
      ignoreAttrs : true
    }, function(err, json) {
      logger.info(err, json);
      if (err) {
        throw new Error(err);
      }
      messages.parse(json.xml, res);
    });
  });

});
module.exports = router;