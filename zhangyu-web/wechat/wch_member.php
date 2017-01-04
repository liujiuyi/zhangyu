<?php
/**
 * wch_member.php UTF-8
 * Author: liujiuyi
 * Date: 2016-04-18
 */
define('IN_ECS', true);
require (dirname ( __FILE__ ) . '/../includes/init.php');
function wxh_check_user($openid, $access_token){
  $query_sql = "SELECT * FROM " . $GLOBALS['ecs']->table('users') . " WHERE `openid` = '$openid' ";
  $row = $GLOBALS['db']->getRow($query_sql);
  if (empty($row) || count($row) == 0)
  {
    $get_user_info_url = "https://api.weixin.qq.com/sns/userinfo?access_token=$access_token&openid=$openid";
    $ch = curl_init ();
    curl_setopt ( $ch, CURLOPT_URL, $get_user_info_url );
    curl_setopt ( $ch, CURLOPT_HEADER, 0 );
    curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, 10 );
    $res = curl_exec ( $ch );
    curl_close ( $ch );
    // 解析json
    $user_obj = json_decode ( $res, true );
    if (! empty ( $user_obj ) && count ( $user_obj ) > 0) {
      $headimgurl = $user_obj ['headimgurl'];
    }
    //注册用户
    $username = randNum();
    $password = randNum(10);
    $email = $openid."@null.null";
    //将该用户名插入到数据库中
    if($GLOBALS['user']->add_user($username, $password, $email)){
        $query_sql = "SELECT * FROM " . $GLOBALS['ecs']->table('users') . " WHERE `user_name` = '$username' ";
        $row = $GLOBALS['db']->getRow($query_sql);
        $userid = $row['user_id'];
        $usernameT = $username . $userid;
        // 根据username更新微信id和用户名
        $reg_time = local_strtotime(local_date('Y-m-d H:i:s'));
        $update_sql = "UPDATE " . $GLOBALS['ecs']->table('users') . " SET user_name = '$usernameT', openid = '$openid', headimgurl = '$headimgurl', reg_time = '$reg_time' WHERE user_name = '$username'";
        $GLOBALS['db']->query($update_sql);
    }
    //检索插入结果
    $query_sql = "SELECT * FROM " . $GLOBALS['ecs']->table('users') . " WHERE `openid` = '$openid' ";
    $row = $GLOBALS['db']->getRow($query_sql);
  }
  return $row;
}
/*
 * 随机数
 * */
function randNum($num = 6){
	$returnValue = "";
	for($i=0;$i<$num;$i++){
		$ranNum = rand(0,9);
		$returnValue = $returnValue.$ranNum;
	}
	return $returnValue;
}

