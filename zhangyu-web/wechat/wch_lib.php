<?php

/**
 *
 * wch_lib.php UTF-8
 * Author: liujiuyi
 * Date: 2016-04-18
 *
 */

//引入配置文件
require_once 'wch_config.php';
//环境判断
if (strpos($_SERVER["HTTP_USER_AGENT"], "MicroMessenger"))
{
    if (empty($_SESSION['user_id']))
    {
        $wch_back = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
        $go_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$appid.'&redirect_uri=http://zhangyu.tttalk.org/wechat/wch_init.php&response_type=code&scope=snsapi_userinfo&state='.$wch_back.'#wechat_redirect';

        wch_header($go_url);
    }
}

function wch_header($url)
{
    header('Expires: 0');
    header('Last-Modified: '. gmdate('D, d M Y H:i:s') . ' GMT');
    header('Pragma: no-cache');
    header("Location: $url");
    exit;
}
