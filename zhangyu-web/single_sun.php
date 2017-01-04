<?php
/**
 * ECSHOP 晒单页
 * ============================================================================
 * 
 * 网站地址: http://www.ecmoban.com；
 * ----------------------------------------------------------------------------
 * 这不是一个自由软件！您只能在不用于商业目的的前提下对程序代码进行修改和
 * 使用；不允许对程序代码以任何形式任何目的的再发布。
 * ============================================================================
 * $Author:  $
 * $Id: single_sun.php 17067 2013-11-1 03:59:37Z  $
 */

define('IN_ECS', true);

require(dirname(__FILE__) . '/includes/init.php');

if ((DEBUG_MODE & 2) != 2)
{
    $smarty->caching = true;
}

/* 初始化分页信息 */
$page = isset($_REQUEST['page'])   && intval($_REQUEST['page'])  > 0 ? intval($_REQUEST['page'])  : 1;
$size = isset($_CFG['page_size'])  && intval($_CFG['page_size']) > 0 ? intval($_CFG['page_size']) : 10;
$act = isset($_REQUEST['act']) ? trim($_REQUEST['act']) : 'single_list';
$affiliate = unserialize($GLOBALS['_CFG']['affiliate']);
$smarty->assign('affiliate', $affiliate);

// $cache_id = $action . '-' . $page;

assign_template();
$position = assign_ur_here();
$smarty->assign('page_title', $position['title']); // 页面标题
$smarty->assign('ur_here',    $position['ur_here']);

$smarty->assign('categories',      get_categories_tree()); // 分类树

$sql = "SELECT value FROM " . $ecs->table('shop_config') . " WHERE id = 419";
$row = $db->getRow($sql);
$car_off = $row['value'];
$smarty->assign('car_off',       $car_off);
/* 是否显示积分兑换 */
if (!empty($_CFG['points_rule']) && unserialize($_CFG['points_rule']))
{
	$smarty->assign('show_transform_points',     1);
}
$smarty->assign('helps',      get_shop_help());        // 网店帮助
$smarty->assign('data_dir',   DATA_DIR);   // 数据目录
$smarty->assign('action',     $action);
$smarty->assign('lang',       $_LANG);



/*------------------------------------------------------ */
//-- 晒单列表
/*------------------------------------------------------ */
if($act == 'single_list')
{
	$cat_id = empty($_REQUEST['cid']) ? 0 : $_REQUEST['cid'];
	if(empty($cat_id))
	{
		$cat_sql = "";
	}
	else
	{
		$cat_sql = " AND cat_id=" . $cat_id;
	}
	$sql = "SELECT * FROM " . $ecs->table('cat_recommend');
	$cat = $db->getAll($sql);
	foreach($cat as $val)
	{
		$cat_str .= $val['cat_id'] . ',';
	}
	$cat_str = substr($cat_str, 0, -1);
	$sql = "SELECT * FROM " . $ecs->table('category') . " WHERE cat_id IN($cat_str)";
	$cat_list = $db->getAll($sql);
	
	$page = isset($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;
	$record_count = $db->getOne("SELECT COUNT(*) FROM " .$ecs->table('single') . "WHERE is_audit = 1 $cat_sql");
	
	$pager  = get_pager('single_sun.php', array('act' => $act), $record_count, $page, 12);
	
	$sql = "SELECT distinct single_id, user_name, single_ip, single_name, single_description, single_like FROM " . $ecs->table('single') . "WHERE is_audit=1 $cat_sql ORDER BY addtime DESC";
	$res = $db->selectLImit($sql, $pager['size'], $pager['start']);
	$rows = array();
	$k = 0;
	while($row = $db->fetchRow($res))
	{
		$sql = "SELECT distinct single_id, thumb_url FROM " . $ecs->table('goods_gallery') . "WHERE single_id=" . $row['single_id'];
		$rows[$k] = $db->getRow($sql);
		
		$record_count = $db->getOne("SELECT COUNT(*) FROM " .$ecs->table('comment') . "WHERE single_id = " . $row['single_id']);
		$rows[$k]['comment_num'] = $record_count;
		$rows[$k]['single_like'] = $row['single_like'];
		$rows[$k]['single_description'] = $row['single_description'];
		$rows[$k]['user_name'] = str_replace(substr($row['user_name'], 2, -1), '*****', $row['user_name']);
		$rows[$k]['single_ip'] = $row['single_ip'];
		$k++;
	}
	
	$children = get_children($cat_id);
	$smarty->assign( 'bestGoods',      get_category_recommend_goods('best', $children));
	$smarty->assign( 'newGoods',      get_category_recommend_goods('new', $children));
	$smarty->assign( 'hotGoods',      get_category_recommend_goods('hot', $children, $brand = 0, $min =0,  $max = 0, $ext='' ,$num = 'hot_single'));
	$smarty->assign('cat_list', $cat_list);
	$smarty->assign('single_list', $rows);
    $smarty->assign('pager',  $pager);
    $smarty->assign('ip', real_ip());

    $smarty->display('single_list.dwt');
}

/*------------------------------------------------------ */
//-- 晒单详情页
/*------------------------------------------------------ */
elseif(!empty($_REQUEST['act']) && $_REQUEST['act'] == 'single_show')
{
	$sid = empty($_REQUEST['sid']) ? 0 :$_REQUEST['sid'];
	if(empty($sid))
	{
		ecs_header("Location: ./\n");
		
		exit;
	}
	
	$sql = "SELECT single_id, single_name, single_description, single_ip, single_like, user_name, addtime, goods_name, goods_id, order_time, comment_id FROM " . $ecs->table('single') .
	  " WHERE single_id='$sid'";
	$single = $db->getRow($sql);
	if(empty($single))
	{
		ecs_header("location: ./\n");
		
		exit;
	}
	
	$single['addtime'] = local_date($GLOBALS['_CFG']['time_format'], $single['addtime']);
	$single['user_name'] = str_replace(substr($single['user_name'], 2, -1), '*****', $single['user_name']);

	$sql = "SELECT img_url, thumb_url FROM " . $ecs->table('goods_gallery') . " WHERE single_id=" . $single['single_id'];
	$img_list = $db->getAll($sql);
	
	//上一条
	$prev = $db->getRow("SELECT single_id, single_name FROM " . $ecs->table('single') . " WHERE single_id < " . $single['single_id'] . " ORDER BY single_id DESC");
	//下一条
	$next = $db->getRow("SELECT single_id, single_name FROM " . $ecs->table('single') . " WHERE single_id > " . $single['single_id'] . " ORDER BY single_id DESC");
	
	$related = $db->getAll("SELECT link_goods_id FROM " . $ecs->table('link_goods') . " WHERE goods_id=" . $single['goods_id']);
	
	foreach($related as $val)
	{
		$goods_str .= $val['link_goods_id'] . ',';
	}
	$goods_str = substr($goods_str, 0, -1);
	if(!empty($goods_str))
	{
		$r_sql = "SELECT * FROM " . $ecs->table('goods') . " WHERE goods_id IN($goods_str)";
		$goods_relateds = $db->selectLimit($r_sql, 5);
		$goods = array();
		$g = 0;
		while($row = $db->fetchRow($goods_relateds))
		{
			$goods[$g]['goods_name'] = $row['goods_name'];
			$goods[$g]['goods_thumb'] = $row['goods_thumb'];
			$goods[$g]['goods_id'] = $row['goods_id'];
			$goods[$g]['shop_price'] = $row['shop_price'];
			$g++;
		}
	}
	
	$page = isset($_REQUEST['page']) ? intval($_REQUEST['page']) : 1;
	
	$record_count = $db->getOne("SELECT COUNT(*) FROM " .$ecs->table('comment') . "WHERE single_id = " . $single['single_id']);
	
	$pager  = get_pager('single_sun.php', array('act' => $act, 'sid' => $single['single_id']), $record_count, $page, 28);

	$sql = "SELECT * FROM " . $ecs->table('comment') . " WHERE single_id=" . $single['single_id'] . " ORDER BY add_time DESC";
	$comment = $db->selectLImit($sql, $pager['size'], $pager['start']);
	$comment_list = array();
	$key = 0;
	while($comm = $db->fetchRow($comment))
	{
		$comment_list[$key]['comment_id'] = $comm['comment_id'];
		$comment_list[$key]['content'] = $comm['content'];
		if(!empty($comm['add_time']))
		{
			$comment_list[$key]['add_time'] = local_date($GLOBALS['_CFG']['time_format'], $comm['add_time']);
		}
		if(!empty($comm['user_name']))
		{
			$comment_list[$key]['user_name'] = str_replace(substr($comm['user_name'], 1, -1), '*****', $comm['user_name']);
		}
		$key++;
	}
	if($goods[0]['goods_id'] == null)
	{
		$goods = null;
	}
	$position = assign_ur_here(0, $single['single_name']);
	$smarty->assign('ip', real_ip());
	$smarty->assign('goods', $goods);
	$smarty->assign('page_title', $position['title']); // 页面标题
	$smarty->assign('ur_here',    $position['ur_here']);
	$smarty->assign('comment_num', $record_count);
	$smarty->assign('pager', $pager);
	$smarty->assign('comment_list', $comment_list);
	$smarty->assign('prev', $prev);
	$smarty->assign('next', $next);
	$smarty->assign('num', count($img_list));
	$smarty->assign('img_list', $img_list);
	$smarty->assign('photo', $img_list[0]['thumb_url']);
	$smarty->assign('single', $single);
	$smarty->display('single_show.dwt');
}


/*------------------------------------------------------ */
//-- 晒单喜欢+1
/*------------------------------------------------------ */
elseif($_REQUEST['act'] == 'check_like')
{
	require_once (dirname(__FILE__) . '/includes/cls_json.php');
	$json = new JSON();
	$id = empty($_REQUEST['id']) ? 0 : intval($_REQUEST['id']);
    $ip     = real_ip();
	if(!empty($id))
	{
		
		$sql = 'SELECT COUNT(*) FROM '.$ecs->table('single')." WHERE single_ip='$ip' AND single_id='$id' ";
		$count = $db->getOne($sql);
		if($count < 1)
		{
			$sql = "UPDATE " . $ecs->table('single') . " SET single_like=single_like+1, single_ip='$ip' WHERE single_id=" . $id;
			if($db->query($sql))
			{
				$res = array('option' => '已喜欢', 'id' => $id);
				die($json->encode($res));
			}
			else
			{
				$res = array('error' => '错误');
				die($json->encode($res));
			}
		}
	}
	
}


?>

