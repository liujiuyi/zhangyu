/*******init start*****/

var httpUrl="http://"+location.hostname;

/*******init end*****/

$(function(){
	/**************通用效果*****************/
	$(".small_topbanner3 a").mouseenter(function(){
		$(this).children("u").show();									 
	})
	$(".small_topbanner3 a").mouseleave(function(){
		$(this).children("u").hide();									 
	})
	
	$(".hd_login_wrap").mouseenter(function(){
		$(this).addClass("hd_login_hover");
		$(this).children("ul").show();									 
	})
	$(".hd_login_wrap").mouseleave(function(){
		$(this).removeClass("hd_login_hover");								
		$(this).children("ul").hide();									 
	})
		
	$("#shopping_list_btn").click(function(){

		if($("#shopping_list_index").hasClass("shoplistcur"))
		{
			$("#shopping_list_index").removeClass("shoplistcur");
		}
		else
		{
			$("#shopping_list_index").addClass("shoplistcur");
		}
		
		if($("#searchList_index").is(":hidden"))
		{
			$("#searchList_index").show();
			
			if(getCookie('guidance'))
			{
				var guidance_num = getCookie('guidance');
			}
			else
			{
				var guidance_num = 0;
				$("#guidance").show();
			}
			if(guidance_num == 0)
			{
				guidance_num++;
				setCookie('guidance',guidance_num,1);
			}
		}
		else
		{
			$("#searchList_index").hide();
		}
	})
	
	$(".shopClose").click(function(){
		$("#searchList_index").hide();
		$("#shopping_list_index").removeClass("shoplistcur");				   
	})
	
	$(".guide_next").click(function(){
		if($("#guidance").attr("class") == "guide_step1")
		{
			$("#guidance").removeClass("guide_step1");
			$("#guidance").addClass("guide_step2");
		}
		else if($("#guidance").attr("class") == "guide_step2")
		{
			$("#guidance").removeClass("guide_step2");
			$("#guidance").addClass("guide_step3");
		}
	})
	
	$(".guide_close").click(function(){
		$("#guidance").hide();		
		$("#guidance").removeClass("guide_step3");
		$("#guidance").addClass("guide_step1");
	})
	
	$("#operat").click(function(){
		$("#shopping_list_textarea").val("");							
	})
	
	$("#btn").click(function(){
		var key_word = $("#shopping_list_textarea").val();	
		var reg=new RegExp("[,|，]","g"); 
		key_word = key_word.replace(reg,"\n");
		var key_arr = new Array();
		var key_arr_dou = new Array();
		var key_arr = key_word.split("\n");
		var key_words = "";
		
		for(var i=0;i<key_arr.length;i++)
		{			
			if(i == key_arr.length-1)
			{
				key_words+= key_arr[i];
			}
			else
			{
				key_words+= key_arr[i]+" OR ";	
			}
		}
		var url = "search.php?keywords="+key_words;
		location.href=url;
	})
	
	$("#allSortOuterbox").mouseenter(function(){
		$("#allSortOuterbox .no_index").show();
	})
	
	$("#allSortOuterbox").mouseleave(function(){
		$("#allSortOuterbox .no_index").hide();
	})
	

	
	$(".hd_allsort li").mouseenter(function(){
		$("#allSortOuterbox").addClass("hover");
		$(this).addClass("cur");
		$(this).children("h3").css('width','166px');		
		$(this).children("div").show();
		
		var n = $("#allCategoryHeader").offset().top; 
		var l = $(this); 
		var m = l.offset().top - n; 
		var k = l.find(".hd_show_sort");  
		var j = $(document).scrollTop();
		var p = m + k.height() + n - j;
		var o = $(window).height();
		var i = p - o;
		if (p > o) {
			if (l.offset().top - j + l.height() - o > -10) {
				m = l.position().top - k.height() + l.height() - 2
			} else {
				m = m - i - 10
			}
		}
		if (k.height() > o) {
			 m = j - n
		}
		k.css({
			top: m
		})
	})
	
	$(".hd_allsort li").mouseleave(function(){							
		$(this).children("div").hide();	
		$(this).children("h3").css('width','165px');		
		$("#allSortOuterbox").removeClass("hover");
		$(this).removeClass("cur");
	})
		
	$(".close_sort").click(function(){
		var li_obj = $(this).parents("li");	
		li_obj.children("div").hide();	
		li_obj.children("h3").css('width','165px');		
		$("#allSortOuterbox").removeClass("hover");
		li_obj.removeClass("cur");
	})
	
	$("#ECS_CARTINFO").mouseenter(function(){
		$("#ECS_CARTINFO").addClass("over-min-cart");
		$("#showMiniCart").show();
					
	})
	
	$("#ECS_CARTINFO").mouseleave(function(){
		$("#ECS_CARTINFO").removeClass("over-min-cart");
		$("#showMiniCart").hide();			
	})
	
	$(".minicart_box").mouseenter(function(){
		$("#showMiniCart").show();
	})
	
	$(".minicart_box").mouseleave(function(){
		$("#showMiniCart").hide();
	})


})

if(screen.width > 1210 && $(window).width() > 1210)
{
	$("body").addClass("w1200");
}
else
{
	$("#promo_show #index_menu_carousel ol li a:not(.mini_promo a)").addClass("big_pic");
}

//写入cookies
function setCookie(c_name,value,expiredays)
{
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
//读取cookies
function getCookie(c_name)
{
	if (document.cookie.length>0)
	{
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start!=-1)
		{ 
			c_start=c_start + c_name.length+1 
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end))
		} 
	}
	
	return ""
}

function bookmark() {
    var c;
    var a = /^http{1}s{0,1}:\/\/([a-z0-9_\\-]+\.)+(yihaodian|1mall|111|yhd){1}\.(com|com\.cn){1}\?(.+)+$/;
    if (a.test(httpUrl)) {
        c = "&ref=favorite"
    } else {
        c = "?ref=favorite"
    }
    var d = httpUrl + c;
    if ('undefined' == typeof (document.body.style.maxHeight)) {
        d = httpUrl
    }
    try {
        if (document.all) {
            window.external.AddFavorite(d, favorite)
        } else {
            try {
                window.sidebar.addPanel(favorite, d, "")
            } catch(b) {
                alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加")
            }
        }
    } catch(b) {
        alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加")
    }
}



/********迷你购物车加减********/
function onClickCartNum(a,b)
{
	var b = parseInt(b);
	var c = $("#minicart_num_"+a);
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
	
	change_goods_number(a,e);
}

function keyUpCartNum(a,b)
{
	var c = parseInt($(a).val());
	if(c < 1 || !$.isNumeric(c))
	{
		alert("请输入正确的商品数量");	
		d = $(a).val(1);
	}

	change_goods_number(b,d);

}


function change_goods_number(rec_id, goods_number)
{     
	Ajax.call('flow.php?step=ajax_update_cart', 'rec_id=' + rec_id +'&goods_number=' + goods_number, change_goods_number_response, 'POST','JSON');
}
function change_goods_number_response(result)
{               
	if (result.error == 0)
	{
		var rec_id = result.rec_id;
		$('#minicart_num_' +rec_id).val(result.goods_number);//更新数量		
		$('#totalDesc').html("¥"+result.total_price); //更新合计
		$('#totalNumber').html(result.total_goods_count);//更新购物车数量
		$('#in_cart_num').html(result.total_goods_count)
	}
	else if (result.message != '')
	{
		alert(result.message);                
	}
}

