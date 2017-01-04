<?php

/**
 * ECTouch Open Source Project
 * ============================================================================
 * Copyright (c) 2012-2014 http://ectouch.cn All rights reserved.
 * ----------------------------------------------------------------------------
 * 文件名称：alipay_wap.php
 * ----------------------------------------------------------------------------
 * 功能描述：手机支付宝支付插件
 * ----------------------------------------------------------------------------
 * Licensed ( http://www.ectouch.cn/docs/license.txt )
 * ----------------------------------------------------------------------------
 */

/* 访问控制 */
defined ( 'IN_ECTOUCH' ) or die ( 'Deny Access' );

$payment_lang = ROOT_PATH . 'plugins/payment/language/' . C ( 'lang' ) . '/' . basename ( __FILE__ );

if (file_exists ( $payment_lang )) {
 include_once ($payment_lang);
 L ( $_LANG );
}

/* 模块的基本信息 */
if (isset ( $set_modules ) && $set_modules == TRUE) {
 $i = isset ( $modules ) ? count ( $modules ) : 0;
 /* 代码 */
 $modules [$i] ['code'] = basename ( __FILE__, '.php' );
 /* 描述对应的语言项 */
 $modules [$i] ['desc'] = 'wxpay_desc';
 /* 是否支持货到付款 */
 $modules [$i] ['is_cod'] = '0';
 /* 是否支持在线支付 */
 $modules [$i] ['is_online'] = '1';
 /* 作者 */
 $modules [$i] ['author'] = 'ECTOUCH TEAM';
 /* 网址 */
 $modules [$i] ['website'] = 'http://www.ectouch.cn';
 /* 版本号 */
 $modules [$i] ['version'] = '1.0.0';
 /* 配置信息 */
 $modules [$i] ['config'] = array (
   array (
     'name' => 'wxpay_appid',
     'type' => 'text',
     'value' => '' 
   ),
   array (
     'name' => 'wxpay_key',
     'type' => 'text',
     'value' => '' 
   ),
   array (
     'name' => 'wxpay_mchid',
     'type' => 'text',
     'value' => '' 
   ),
   array (
     'name' => 'wxpay_secret',
     'type' => 'text',
     'value' => '' 
   ),
   array (
     'name' => 'wxpay_appkey',
     'type' => 'text',
     'value' => '' 
   ) 
 );
 
 return;
}

/**
 * 支付插件类
 */
class wxpay {
 private $_redis = null;
 public $wxpay_mchid;
 public $wxpay_appid;
 public $wxpay_key;
 public $wxpay_secret;
 public $wxpay_appkey;
 /**
  * 生成支付代码
  *
  * @param array $order
  *         订单信息
  * @param array $payment
  *         支付方式信息
  */
 function get_code($order, $payment) {
  include_once (ROOT_PATH . "../wechat/WxPayPubHelper/WxPayPubHelper.php");
  
  $jsApi = new JsApi_pub ();
  $timeStamp = time ();
  
  $openid = $_COOKIE ["sopenid"];
  
  $unifiedOrder = new UnifiedOrder_pub ();
  $unifiedOrder->setParameter ( "openid", "$openid" ); // 商品描述
  $unifiedOrder->setParameter ( "body", "pay" ); // 商品描述
  $ordermount = $order ['order_amount'] * 100;
  $out_trade_no = $order ['order_sn'] . 'O' . $order ['log_id'];
  // $out_trade_no = WxPayConf_pub::APPID."$timeStamp";
  $unifiedOrder->setParameter ( "out_trade_no", "$out_trade_no" ); // 商户订单号
  $unifiedOrder->setParameter ( "total_fee", "$ordermount" ); // 总金额
  $unifiedOrder->setParameter ( "notify_url", "http://zhangyu.tttalk.org/mobile/notify_wap_wxpay.php"); // 通知地址
  $unifiedOrder->setParameter ( "trade_type", "JSAPI" ); // 交易类型
  
  $prepay_id = $unifiedOrder->getPrepayId ();
  
  // =========步骤3：使用jsapi调起支付============
  $jsApi->setPrepayId ( $prepay_id );
  
  $jsApiParameters = $jsApi->getParameters ();
 
  // 　
  $rejs = '	<script type="text/javascript"> function jsApiCall()
		{
			WeixinJSBridge.invoke(
				"getBrandWCPayRequest",
				' . $jsApiParameters . ',
				function(res){
					WeixinJSBridge.log(res.err_msg);
				}
			);
		}
		
		function callpay()
		{
			if (typeof WeixinJSBridge == "undefined"){
			    if( document.addEventListener ){
			        document.addEventListener(\'WeixinJSBridgeReady\', jsApiCall, false);
			    }else if (document.attachEvent){
			        document.attachEvent(\'WeixinJSBridgeReady\', jsApiCall); 
			        document.attachEvent(\'onWeixinJSBridgeReady\', jsApiCall);
			    }
			}else{
			    jsApiCall();
			}
		} </script>';
  
  $button = $rejs . ' <div><input type="button" id="chooseWXPay" class="btn btn-info ect-btn-info ect-colorf ect-bg"  onclick="callpay();" value="' . l ( 'pay_button' ) . '"  /></div>';
  return $button;
 }
 public function notify($data) {
  $this->callback ( $data );
 }
 public function callback($data) {
  include_once (ROOT_PATH . "../wechat/WxPayPubHelper/WxPayPubHelper.php");
  
  // 使用通用通知接口
  $notify = new Notify_pub ();
  
  // 存储微信的回调
  
  $xml = $GLOBALS ['HTTP_RAW_POST_DATA'];
  $notify->saveData ( $xml );
  
  // 验证签名，并回应微信。
  // 对后台通知交互时，如果微信收到商户的应答不是成功或超时，微信认为通知失败，
  // 微信会通过一定的策略（如30分钟共8次）定期重新发起通知，
  // 尽可能提高通知的成功率，但微信不保证通知最终能成功。
  // if($notify->checkSign($this->wxpay_key) == FALSE){
  // $notify->setReturnParameter("return_code","FAIL");//返回状态码
  // $notify->setReturnParameter("return_msg","签名失败");//返回信息
  // }else{
  $notify->setReturnParameter ( "return_code", "SUCCESS" ); // 设置返回码
                                                        // }
  $returnXml = $notify->returnXml ();
  // exit($returnXml);
  // ==商户根据实际情况设置相应的处理流程，此处仅作举例=======
  
  // 以log文件形式记录回调信息
  if ($notify->checkSign () == TRUE) {
   /*
    * if ($notify->data["return_code"] == "FAIL") {
    * //此处应该更新一下订单状态，商户自行增删操作
    * $log_->log_result($log_name,"【通信出错】:\n".$xml."\n");
    * }
    * elseif($notify->data["result_code"] == "FAIL"){
    * //此处应该更新一下订单状态，商户自行增删操作
    * $log_->log_result($log_name,"【业务出错】:\n".$xml."\n");
    * }
    * else{
    * //此处应该更新一下订单状态，商户自行增删操作
    * $log_->log_result($log_name,"【支付成功】:\n".$xml."\n");
    * }
    */
   // 商户自行增加处理流程,
   // 例如：更新订单状态
   // 例如：数据库操作
   // 例如：推送支付完成信息
   // $out_trade_no=$notify->data["out_trade_no"];
   
   $out_trade_no = explode ( 'O', $notify->data ["out_trade_no"] );
   $log_id = $out_trade_no [1];
   $payment = model ( 'Payment' )->get_payment ( $notify->data ['code'] );
   
   model ( 'Payment' )->order_paid ( $log_id, 2 );
   return true;
  } else {
   return false;
  }
 }
 function get_real_ip() {
  $ip = false;
  if (! empty ( $_SERVER ["HTTP_CLIENT_IP"] )) {
   $ip = $_SERVER ["HTTP_CLIENT_IP"];
  }
  if (! empty ( $_SERVER ['HTTP_X_FORWARDED_FOR'] )) {
   $ips = explode ( ", ", $_SERVER ['HTTP_X_FORWARDED_FOR'] );
   if ($ip) {
    array_unshift ( $ips, $ip );
    $ip = FALSE;
   }
   for($i = 0; $i < count ( $ips ); $i ++) {
    if (! eregi ( "^(10|172\.16|192\.168)\.", $ips [$i] )) {
     $ip = $ips [$i];
     break;
    }
   }
  }
  return ($ip ? $ip : $_SERVER ['REMOTE_ADDR']);
 }
 public function jsapi_ticket($code, $cache = true) {
  if (empty ( $code )) {
   return false;
  }
  $code_token_key = 'code_token_key';
  if (empty ( $_COOKIE [$code_token_key] )) {
   $_COOKIE [$code_token_key] = md5 ( time () . $_SERVER ['REMOTE_ADDR'] );
   setcookie ( $code_token_key, $key, time () + 86400, '/' );
  }
  $key = $_COOKIE [$code_token_key];
  if (! $at = $this->_redis_get ( $key ) && $cache) {
   $at = $this->open ( "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" . $code . "&type=jsapi" );
   
   $this->_redis_set ( $code_token_key . $key, $at, $at ['expires_in'] );
  }
  return $at ['ticket'];
 }
 
 /**
  * 获取access token
  * 
  * @return array
  */
 public function access_token($cache = true) {
  $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" . $this->wxpay_appid . "&secret=" . $this->wxpay_secret;
  
  $access_token_key = '_wx_access_token_cy_20140423_';
  
  $access_token = $this->_redis_get ( $access_token_key );
  
  if (! empty ( $access_token ) && $cache) {
   return $access_token;
  }
  try {
   $ret = $this->open ( $url );
   
   $this->_redis_set ( $access_token_key, $ret ['access_token'], $ret ['expires_in'] );
   return $ret ['access_token'];
  } catch ( Exception $e ) {
   return '';
  }
 }
 public function createNonceStr($length = 16) {
  $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  $str = "";
  for($i = 0; $i < $length; $i ++) {
   $str .= substr ( $chars, mt_rand ( 0, strlen ( $chars ) - 1 ), 1 );
  }
  return $str;
 }
 public function open($api_url) {
  $ch = curl_init ();
  curl_setopt ( $ch, CURLOPT_URL, $api_url );
  curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, TRUE );
  curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, 15 );
  curl_setopt ( $ch, CURLOPT_SSL_VERIFYPEER, false );
  $ret = curl_exec ( $ch );
  $error = curl_error ( $ch );
  
  if ($error) {
   return false;
  }
  
  $json = json_decode ( $ret, TRUE );
  
  return $json;
 }
 public function post($api_url, $data) {
  $context = array (
    'http' => array (
      'method' => "POST",
      'header' => "User-Agent: Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) \r\n Accept: */*",
      'content' => $data 
    ) 
  );
  $stream_context = stream_context_create ( $context );
  $ret = @file_get_contents ( $api_url, FALSE, $stream_context );
  return json_decode ( $ret, true );
 }
 private function _redis_connect() {
  if (empty ( $this->_redis )) {
   try {
    $this->_redis = new Redis ();
    $this->_redis->connect ( '127.0.0.1', 6379 );
   } catch ( Exception $e ) {
    return false;
   }
  }
  return $this->_redis;
 }
 private function _redis_set($key, $val, $lifetime = 0) {
  if ($this->_redis_connect ()) {
   return $this->_redis->set ( $key, $val, $lifetime );
  }
  return false;
 }
 private function _redis_get($key) {
  if ($this->_redis_connect ()) {
   
   return $this->_redis->get ( $key );
  }
  return false;
 }
 private function createlinkstring($para) {
  $arg = "";
  foreach ( $para as $key => $val ) {
   $arg .= strtolower ( $key ) . "=" . $val . "&";
  }
  // 去掉最后一个&字符
  $arg = substr ( $arg, 0, count ( $arg ) - 2 );
  
  // 如果存在转义字符，那么去掉转义
  if (get_magic_quotes_gpc ()) {
   $arg = stripslashes ( $arg );
  }
  
  return $arg;
  /*
   * return http_build_query($para);
   */
 }
 function trimString($value) {
  $ret = null;
  if (null != $value) {
   $ret = $value;
   if (strlen ( $ret ) == 0) {
    $ret = null;
   }
  }
  return $ret;
 }
 
 /**
  * 作用：产生随机字符串，不长于32位
  *
  * public function createNoncestr( $length = 32 )
  * {
  * $chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  * $str ="";
  * for ( $i = 0; $i < $length; $i++ ) {
  * $str.= substr($chars, mt_rand(0, strlen($chars)-1), 1);
  * }
  * return $str;
  * }
  */
 
 /**
  * 作用：格式化参数，签名过程需要使用
  */
 function formatBizQueryParaMap($paraMap, $urlencode) {
  $buff = "";
  ksort ( $paraMap );
  foreach ( $paraMap as $k => $v ) {
   if ($urlencode) {
    $v = urlencode ( $v );
   }
   // $buff .= strtolower($k) . "=" . $v . "&";
   $buff .= $k . "=" . $v . "&";
  }
  $reqPar;
  if (strlen ( $buff ) > 0) {
   $reqPar = substr ( $buff, 0, strlen ( $buff ) - 1 );
  }
  return $reqPar;
 }
 
 /**
  * 作用：生成签名
  */
 public function getSign($Obj, $appkey1) {
  foreach ( $Obj as $k => $v ) {
   $Parameters [$k] = $v;
  }
  // 签名步骤一：按字典序排序参数
  ksort ( $Parameters );
  $String = $this->formatBizQueryParaMap ( $Parameters, false );
  // echo '【string1】'.$String.'</br>';
  // 签名步骤二：在string后加入KEY
  $String = $String . "&key=" . $appkey1;
  // echo "【string2】".$String."</br>";
  // 签名步骤三：MD5加密
  $String = md5 ( $String );
  // echo "【string3】 ".$String."</br>";
  // 签名步骤四：所有字符转为大写
  $result_ = strtoupper ( $String );
  // echo "【result】 ".$result_."</br>";
  return $result_;
 }
 
 /**
  * 作用：array转xml
  */
 function arrayToXml($arr) {
  $xml = "<xml>";
  foreach ( $arr as $key => $val ) {
   if (is_numeric ( $val )) {
    $xml .= "<" . $key . ">" . $val . "</" . $key . ">";
   } else
    $xml .= "<" . $key . "><![CDATA[" . $val . "]]></" . $key . ">";
  }
  $xml .= "</xml>";
  return $xml;
 }
 
 /**
  * 作用：将xml转为array
  */
 public function xmlToArray($xml) {
  // 将XML转为array
  $array_data = json_decode ( json_encode ( simplexml_load_string ( $xml, 'SimpleXMLElement', LIBXML_NOCDATA ) ), true );
  return $array_data;
 }
}

