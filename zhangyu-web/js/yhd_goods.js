
$(function(){
	
	/******商品详情页单选属性点击效果********/
	$(".tastelist ul li").click(function(){
		var a = $(this).find(":radio");
		a.prop("checked",true);
		$(this).parents(".tastelist").find(".selected").removeClass("selected");
		$(this).addClass("selected");
		changePrice();
	})	
	/******销售排行切换效果********/

	$(".sidlist_slide li").hover(function() {
            $(this).find("u").stop(true).animate({
                right: -50
            },
            100);
            $(this).stop(true).animate({
                marginLeft: -20
            },
            200);
        },
        function() {
            $(this).stop(true).animate({
                marginLeft: 45
            },
            200);
            $(this).find("u").stop(true).animate({
                right: 52
            },
            200);
     })
	 
	 
	 
	var e = $("#J_des");
	var a = $("#J_fixedDes");
	var d = $("#J_asideFixed");
	var c = d.find(">ul");
	var b = true;
	$("#detail_desc_tab .tab").click(function(h) {
		var g = $(this);
		if (!g.hasClass("cur")) {
			var f = g.index();
			$("#detail_desc_tab .tab").removeClass("cur").eq(f).addClass("cur");
			$("#detail_desc_tab_fixed .tab").removeClass("cur").eq(f).addClass("cur");
			if (f == 0) {
				b = true
			} else {
				b = false
			}
			if (a.length) {
				b ? c.show().prev().css("display", "block") : c.hide().prev().hide()
			}
			onTabTitleClickEvent(g)
		}
	});
	
	$("#detail_desc_tab_fixed .tab").click(function(h) {
		var g = $(this);
		if (!g.hasClass("cur")) {
			var f = g.index();
			$("#detail_desc_tab .tab").removeClass("cur").eq(f).addClass("cur");
			$("#detail_desc_tab_fixed .tab").removeClass("cur").eq(f).addClass("cur");
			if (f == 0) {
				b = true
			} else {
				b = false
			}
			if (a.length) {
				b ? c.show().prev().css("display", "block") : c.hide().prev().hide()
			}
			onTabTitleClickEvent(g);
			scrollToDivById("#J_des");
		}
	});
	
	
	//弹出评论层
	$(".open_comment").click(function(){
		easyDialog.open({
			container : 'comment_show',
			fixed : true,
			drag : true
		});
	})
	
	$(".popwinClose").click(function(){
		easyDialog.close();
	})
	
	$("#detail_img_slider").slide({
		mainCell:"#J_tabSlider ul",
		vis:5,
		prevCell:".pre_btn",
		nextCell:".next_btn",
		effect:"leftLoop"
	})
	
	$("#J_tabSlider ul li a").click(function(){
		$("#J_tabSlider ul li").removeClass("cur");
		$(this).parent().addClass("cur");
	})
	
	//商品详情页数量
	$("#product_amount").keyup(function(){
		var a = $("#product_amount").val();
		if(a < 1)
		{
			alert("最小购买数量为1件")	
		}
		else if(a == 1)
		{
			if($(".no_reduce").length < 1)
			{
				$(".reduce").removeClass("reduce").addClass("no_reduce");
			}
		}
		else
		{
			$(".no_reduce").removeClass("no_reduce").addClass("reduce");
		}
		changePrice();
	})
	
	if($("#product_amount").val() > 1)
	{
		$(".no_reduce").removeClass("no_reduce").addClass("reduce");
		changePrice();
	}
	

	$(".add").click(function(){
		var a = $("#product_amount").val();
		a++;
		$("#product_amount").val(a);
		if(a > 1)
		{
			$(".no_reduce").removeClass("no_reduce").addClass("reduce");
		}
		changePrice();
	})
	
	$("#reduce").click(function(){
		
		var a = $("#product_amount").val();
		a--;
		if(a < 2)
		{
			$("#product_amount").val(1);
			$(this).removeClass("reduce").addClass("no_reduce");
		}
		else
		{
			$("#product_amount").val(a);
		}
		changePrice();
	})

	
	
	$(".fittings_content").each(function(i){
		i++;
		$(".container"+i).hScrollPane({
			mover:"ul", //指定container对象下的哪个元素需要滚动位置 | 必传项;
			showArrow:true, //指定是否显示左右箭头，默认不显示 | 可选项;
			moverW:function(){return $(".container"+i+" li").length*258}(),
			//moverW:function(){return $(".press").width();}(), //传入水平滚动对象的长度值,不传入的话默认直接获取mover的宽度值 | 可选项;
			//handleMinWidth:50,//指定handle的最小宽度,要固定handle的宽度请在css中设定handle的width属性（如 width:28px!important;），不传入则不设定最小宽度 | 可选项;
			//dragable:true, //指定是否要支持拖动效果，默认可以拖动 | 可选项;
			//easing:true, //滚动是否需要滑动效果,默认有滑动效果 | 可选项;
			//handleCssAlter:"draghandlealter", //指定拖动鼠标时滚动条的样式，不传入该参数则没有变化效果 | 可选项;
			mousewheel:{bind:true,moveLength:300} //mousewheel: bind->'true',绑定mousewheel事件; ->'false',不绑定mousewheel事件；moveLength是指定鼠标滚动一次移动的距离,默认值：{bind:true,moveLength:300} | 可选项;
		});
	})
	
	$("#fitAndCombineDiv .pack_tab li").click(function(){
		var a = $("#fitAndCombineDiv .pack_tab li").index($(this));	
		a++;
		$("#fitAndCombineDiv .pack_tab li").removeClass("cur");
		$("#fitAndCombineDiv #J_packItem .pack_suit").hide();
		$("#optionCollectProdsContent"+a).show();
		$("#optionCollectProdsTitle"+a).addClass("cur");
	})	
})


function scrollToDivById(a) {
	var b = $(a).offset().top;
	scrollToTop(b - 2)
}
function scrollToTop(a) {
	$("body,html").animate({
		scrollTop: a
	},80)
}

function onTabTitleClickEvent(c) {

	var a = c.attr("tabIndex");
	$("#detail_desc_content .desitem").hide();
	if (a >= 0) {
		$("#detail_desc_fwcl").show();
		$("#detail_desc_findMistake").show();
		$("#detail_desc_content .desitem[tabIndex='" + a + "']").show()
	} else {
		var b = c.attr("id");
		
		if ("desc_sppj" == b || "desc_sppj_fixed" == b) {
			$("#detail_desc_fwcl").hide();
			$("#detail_desc_findMistake").hide();
			$("#buyer_experience").show();

		}
	}
}



$(function (){
$(".spec_img_list li").mouseenter(function(){
		$(this).addClass("hover");
	})
	
	$(".spec_img_list li").mouseleave(function(){
		$(this).removeClass("hover");
	})
	
	$(".spec_img_list li").click(function(){
		
		$(this).parent().find("li").removeClass("onlickSpec");
		$(this).addClass("onlickSpec");
		$(this).parent().find("input:radio").prop("checked",false);
		$(this).find("input:radio").prop("checked",true);
		
	});
	
	$(".spec_img_list .colorBlock a").click(function(){
	
		
		$(this).parents("ul").find("li").removeClass("onlickSpec");
		$(this).parents("li").addClass("onlickSpec");
		$(this).parents(".onlickSpec").find("input:radio").prop("checked",false);
		$(this).parents(".onlickSpec").find("input:radio").prop("checked",true);
		
		var a ="";
		$(".goods-choose-list .onlickSpec").each(function(i){
			a+=' '+$.trim($(this).attr("title"));
		});
	
		
		$("#selAttr").text(a);
		
		
		
	})
})
