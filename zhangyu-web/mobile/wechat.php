<?php
$url = "http://zhangyu.tttalk.org:8092/wechat/wch_init.php";
$code = isset ( $_GET ['code'] ) ? $_GET ['code'] : '';
$wch_back = isset ( $_GET ['state'] ) ? $_GET ['state'] : '';

$url = $url . "?code=" . $code . "&state=" . $wch_back;

echo "<script language='javascript' type='text/javascript'>";
echo "window.location.href='$url'";
echo "</script>";
?> 