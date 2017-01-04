$(function(){
	
	/**************index.dwt效果*****************/
	$("#promo_show").mouseenter(function(){
		$("#promo_show .show_pre").animate({left:'0',opacity:'show'}, 500);	
		$("#promo_show .show_next").animate({right:'0',opacity:'show'}, 500);						 
	});
	
	$("#promo_show").mouseleave(function(){
		$("#promo_show .show_pre").stop(true,false).animate({left:'-45px',opacity:'hide'}, 500);
		$("#promo_show .show_next").stop(true,false).animate({right:'-45px',opacity:'hide'}, 500);							 
	});

	if(screen.width > 1210 && $(window).width() > 1210)
	{
		$(".tab_content").slide({
			mainCell:"ul",
			vis:5,
			scroll:5,
			prevCell:".tabpre",
			nextCell:".tabnext",
			effect:"leftLoop",
			autoPage:true
		});	
		
		$("#promo_show").slide({
		mainCell:"#index_menu_carousel .big_slide",
		effect:"leftLoop",
		prevCell:".show_pre",
		nextCell:".show_next",
		titCell:"#lunboNum li",
		titOnClassName:"cur",
		interTime:"5000",
		autoPlay:true

		});
	}
	else
	{
		$(".tab_content").slide({
			mainCell:"ul",
			vis:4,
			scroll:4,
			prevCell:".tabpre",
			nextCell:".tabnext",
			effect:"leftLoop",
			autoPage:true
		});
		
		$("#promo_show").slide({
		mainCell:"#index_menu_carousel .small_slide",
		effect:"leftLoop",
		prevCell:".show_pre",
		nextCell:".show_next",
		titCell:"#lunboNum li",
		titOnClassName:"cur",
		interTime:"5000",
		autoPlay:true

		});
	}
	
		
	$("#index_recommend_list").slide({
		mainCell:"#recommend_bd",		
		titCell:".pro_tab li",
		titOnClassName:"cur"
	});
	
	$("#index_tuan").slide({
		mainCell:".index_tuan_bd",		
		titCell:".tabs a",
		titOnClassName:"cur"
	});

	$("#index_news").slide({
		mainCell:".index_news_bd",		
		titCell:".tabs a",
		titOnClassName:"cur"
	});
	
	$("#limitBuy li").mouseenter(function(){
		$(this).addClass("on");						 
	});
	
	$("#limitBuy li").mouseleave(function(){
		$(this).removeClass("on");							 
	});


	setInterval(function(){
		$(".endtime").each(function(){
        var obj = $(this);
        var endTime = new Date(parseInt(obj.attr('value')) * 1000);
        var nowTime = new Date();
        var nMS=endTime.getTime() - nowTime.getTime() + 28800000;
        var myD=Math.floor(nMS/(1000 * 60 * 60 * 24));
		//var myH=Math.floor(nMS/(1000*60*60) % 24);
      	var myH=Math.floor(nMS/(1000*60*60));
        var myM=Math.floor(nMS/(1000*60)) % 60;
        var myS=Math.floor(nMS/1000) % 60;
        var myMS=Math.floor(nMS/100) % 10;
	
        if(myH+myM+myS+myMS>= 0){
			//<span>10小时43分58秒
			var str = '<span class="countdown">'+'<span class="h">'+myH+'</span>'+'<span class="m">'+myM+'</span>'+'<span class="s">'+myS+'</span>'+'</span>';
        }else{
			var str = "已结束！";	
		}

		obj.html(str);
      });
    }, 100);
	
	$(".mid_img_list a").mouseenter(function(){
		$(this).addClass("cur");
		$(this).children(".hover_show").show();
	});
	
	$(".mid_img_list a").mouseleave(function(){
		$(this).removeClass("cur");									 
		$(this).children(".hover_show").hide();
	});

	$("input[name='cat_id_ad']").each(function(){
			var cat_id = $(this).val();	
			$("#tab_cat_"+cat_id).slide({
				mainCell:".right_tab_content",		
				titCell:".right_tab li",
				titOnClassName:"cur"
			});		
	});
	
	$(".tab_content_wrap li").mouseenter(function(){
		
		$(this).addClass("cur");
	});
	$(".tab_content_wrap li").mouseleave(function(){
		$(this).removeClass("cur");				  
	});
	
	
})

