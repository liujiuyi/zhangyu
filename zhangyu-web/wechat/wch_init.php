<?php
/**
 *
 * wch_init.php UTF-8
 * Author: liujiuyi
 * Date: 2016-04-18
 *
 */
define('IN_ECS', true);
// 引入配置文件
require_once 'wch_config.php';
require_once 'wch_member.php';
$code = isset ( $_GET ['code'] ) ? $_GET ['code'] : '';
$wch_back = isset ( $_GET ['state'] ) ? $_GET ['state'] : '';
if (! empty ( $code )) {
 // 根据code查询access_token
 $get_token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=$appid&secret=$secret&code=$code&grant_type=authorization_code";
 $ch = curl_init ();
 curl_setopt ( $ch, CURLOPT_URL, $get_token_url );
 curl_setopt ( $ch, CURLOPT_HEADER, 0 );
 curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
 curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, 10 );
 $res = curl_exec ( $ch );
 curl_close ( $ch );
 $json_obj = json_decode ( $res, true );
 if (! empty ( $json_obj ) && count ( $json_obj ) > 0) {
  // 根据openid和access_token查询用户信息
  $access_token = $json_obj ['access_token'];
  $openid = $json_obj ['openid'];
  $userinfo = wxh_check_user($openid, $access_token);
  setcookie("sopenid",$openid,time()+864000,'/');
 }
 // 跳转
 ecs_header ( "Location:$wch_back\n" );
}
