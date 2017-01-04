


/********迷你购物车加减********/
function flowClickCartNum(a,b)
{
	var b = parseInt(b);
	var c = $("#items_"+a);
	var d = parseInt(c.val());
	if(d < 1 || !$.isNumeric(d))
	{
		alert("请输入正确的商品数量");	
		e = 1;
	}
	
	if(b == -1)		
	{
		if(d == 1)
		{
			alert("购买数量不能小于1件");	
		}
		else
		{
			e = d + b;
		}
	}
	else
	{
		e = d + b;
	}
	
	flow_change_goods_number(a,e);
}

function flowkeyUpCartNum(a,b)
{
	var c = parseInt($(a).val());
	if(c < 1 || !$.isNumeric(c))
	{
		alert("请输入正确的商品数量");	
		d = $(a).val(1);
	}

	flow_change_goods_number(b,d);

}

function flow_change_goods_number(rec_id, goods_number)
{     
	Ajax.call('flow.php?step=ajax_update_cart', 'rec_id=' + rec_id +'&goods_number=' + goods_number, flow_change_goods_number_response, 'POST','JSON');
}
function flow_change_goods_number_response(result)
{              

	if (result.error == 0)
	{
		var rec_id = result.rec_id;
		
		$('#items_' +rec_id).val(result.goods_number);//更新数量	
		$('#total_items_' +rec_id).html('<strong class="price">'+result.goods_subtotal+'</strong>');//更新小计	
		$('#amount').html(result.total_price); //更新合计
		$('#totalNumber').html(result.total_goods_count);//更新购物车数量
		$('.bag_total_info_box').html(result.total_info); 
	}
	else if (result.message != '')
	{
		alert(result.message);                
	}
}


