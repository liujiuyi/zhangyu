$(function(){
	
	/**************category.dwt,catrgory_top.dwt效果*****************/
	$(".not_index").mouseenter(function(){
		$(this).find("#allCategoryHeader").show();							
	})
	
	$(".not_index").mouseleave(function(){
		$(this).find("#allCategoryHeader").hide();							
	})
	
	$(".menu_wrap li").mouseenter(function(){
		$(this).addClass("cur");		
		$(this).find(".sub_menu").show();															   
	})
	
	$(".menu_wrap li").mouseleave(function(){
		$(this).removeClass("cur");		
		$(this).find(".sub_menu").hide();															   
	})


	$("#promo_show").mouseenter(function(){
		$(".show_next,.show_pre").css("display","block");		
	})
	$("#promo_show").mouseleave(function(){
		$(".show_next,.show_pre").css("display","none");																	  
	})
	
	$("#hotRecommend .product_item").mouseenter(function(){
		$(this).addClass("cur");		
	})
	$("#hotRecommend .product_item").mouseleave(function(){
		$(this).removeClass("cur");																  
	})
	
	$("#promo_show").slide({
		mainCell:".promo_wrapper ol",
		titCell:".hd li",
		titOnClassName:"cur",
		effect:"leftLoop",
		prevCell:".show_pre",
		nextCell:".show_next"
	});
	
	$(".all-catalog").mouseover(function(){
			$(this).addClass("over-all-cata");
		});
	$(".all-catalog").mouseout(function(){
			$(this).removeClass("over-all-cata");
		})
	
	
	/***顶级分类页商品分类切换***/
	$("#muyingRight .floor_wrap").each(function(i){
		i++;
		$("#floor"+i).slide({mainCell:".bd",titCell:".hd li",titOnClassName:"cur"});

 	});
	
	$("#browseHistory").slide({mainCell:".paging_wrap ul",effect:"leftLoop",pnLoop:"false"});
	if(screen.width > 1210 && $(window).width() > 1210)
	{
		$("#alsoBuyBox").slide({mainCell:".slide_box ul",effect:"leftLoop",pnLoop:"false",autoPage:true,scroll:5,vis:5});
	}
	else
	{
		$("#alsoBuyBox").slide({mainCell:".slide_box ul",effect:"leftLoop",pnLoop:"false",autoPage:true,scroll:4,vis:4});
	}
	
	$(".browse_related_list .slide_box li").mouseenter(function(){
		$(this).addClass("cur");													
	})
	
	$(".browse_related_list .slide_box li").mouseleave(function(){
		$(this).removeClass("cur");													
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
	
	
	 
	var a = 0;
	$(".search_filter h3").bind("click",
	function() {
		if ($(this).next("ul").is(":hidden")) {
			$(this).next("ul").slideDown();
			$(".icon_filter", this).removeClass("icon_close").addClass("icon_open")
		} else {
			if ($(this).next("ul").is(":visible")) {
				var b = $(this).next("ul").height();
				$(this).next("ul").slideUp();
				$(".icon_filter", this).removeClass("icon_open").addClass("icon_close")
			}
		}
		a = b
	}).find("a").bind("click",
	function(b) {
		if ($(this).parent().attr("class") != "all_filter") {
			b.stopPropagation()
		}
	});
	$(".search_filter .all_filter").toggle(function() {
		$(this).siblings("h3").each(function() {
			if ($(this).attr("hid") == 1) {
				$(this).show()
			}
		});
		$(this).children(".icon_filter").removeClass("icon_close").addClass("icon_open");
		$(this).find("a").text("收起")
	},
	function() {
		$(this).siblings("h3").each(function() {
			if ($(this).attr("hid") == 1) {
				$(this).hide()
			}
		});
		$(this).children(".icon_filter").removeClass("icon_open").addClass("icon_close");
		$(this).find("a").text("显示全部分类");
		$(window).scrollTop($(".mod_search_filter").offset().top - $("#headerNav").height())
	})
	
	$("#itemSearchList .search_item").hover(function(){
			$(this).addClass("cur");											  
		},function(){
			$(this).removeClass("cur");			
	})

	/*******悬浮搜索栏+左侧导航*******/


	$(window).scroll(function() {
		var d = $("#headerNav");
		var e = $(document).scrollTop();
		if (e > 210) {
			d.addClass("hd_nav_fixed");
			if ($("#headerNav_box").length == 0) {
				d.after('<p class="headerNav_box" id="headerNav_box"></p>')
			}
		} else {
			$("#headerNav_box").remove();
			d.removeClass("hd_nav_fixed");
			$("#fix_keyword").blur()
		}
	});
	
     /*******IE6下悬浮搜索栏+左侧导航********/
	/*isIe6 = false;
	if ('undefined' == typeof(document.body.style.maxHeight)) {
		isIe6 = true;
	}	 
	
	if (isIe6){
		$(window).scroll(function() {
			var d = $("#headerNav");
			var e = $(document).scrollTop();
			if (e > 210) {
				d.addClass("hd_fixed_ie6");
				var f = $("#headerNav_ifm").length;
				if (f == 0) {
					$('<iframe class=headerNav_ifm id="headerNav_ifm"></iframe>').insertBefore("#headerNav .wrap")
				}
				d.css("top", e)
			} else {
				d.removeClass("hd_fixed_ie6");
				$("#headerNav_ifm").remove();
				d.css("top", "0px");
			}
		})
	}*/
	

	
	/*********搜索点击事件********/
	 var b = $(".mod_search_crumb .crumb_search .input_keyword"),
        c = $(".mod_search_crumb .crumb_search"),
        a = $(".mod_search_crumb .crumb_search .btn_search");
        a.click(function() {
            var d = b.val(),
            e = b.attr("category");
            if (d != "") {
                addTrackPositionToCookie("1", "nav_crumb");
                window.location = URLPrefix.search_keyword + "/s2/c" + e + "-0/k" + encodeURIComponent(encodeURIComponent(d)) + "/"
            }
        });
        $(".mod_search_crumb .crumb_list").hover(function() {
            $(this).addClass("cur").siblings().removeClass("cur")
        },
        function() {
            $(this).removeClass("cur")
        });
        b.focus(function() {
            c.addClass("select");
            $(this).val("");
        }).blur(function() {
            c.removeClass("select");
            if ($(this).val() == "") {
                $(this).val("在分类中查找")
            }
        });
        b.keydown(function(f) {
            f = f || window.event;
            var g = f.keyCode;
            var d = $(this).val(),
            e = $(this).attr("category");
            
        })
		
	//分类页左侧导航点击伸缩
	 $(".search_filter h3").on("click",
        function() {
            if ($(this).next(".search_filter_son").is(":hidden")) {
                $(this).next(".search_filter_son").slideDown();
                $(".icon_filter", this).removeClass("icon_close").addClass("icon_open")
            } else {
                var b = $(this).next(".search_filter_son").height();
                $(this).next(".search_filter_son").slideUp();
                $(".icon_filter", this).removeClass("icon_open").addClass("icon_close")
            }
            a = b
        }).find("a").on("click",
        function(b) {
            b.stopPropagation()
       });
	   
	$(".guide_box .more").click(function(){
		$(this).hide();
		$(this).next().show();
		$(this).parent().prev().css("height","auto");
	})
	
	$(".guide_box .more_open").click(function(){
		$(this).hide();
		$(this).prev().show();
		$(this).parent().prev().css("height","32px");
	})
	

	
	
	
})


/******分类页商品数量加减****/
function modifyBuyNum(d, a) {
	var b;
    var c;
   if (a == -1) {
        c = $(d).parents(".shopping_num").find("input");
        b = parseInt(c.val()) || 1;
        if (b == 1) {
            return
        } else {
            if (b == 2) {
                $(d).attr("class", "dis_decrease")
            } else {
                $(d).prev().attr("class", "add")
            }
            c.val(b + a)
        }
    } else {
        c = $(d).parents(".shopping_num").find("input");
        b = parseInt(c.val()) || 1;
        $(d).next().attr("class", "decrease")
      	c.val(b + a)
    }		
}
	
function checkBuyNum(d) {
	var c = $(d);
	if($.isNumeric($(d).val()) && $(d).val() >= 1)
	{
		var b = c.next().find("a");
		if (c.val() == 1) {
            b.attr("class", "add");
            b.next().attr("class", "dis_decrease")
        } 
		else if(c.val() > 1)
		{
			 b.attr("class", "add");
             b.next().attr("class", "decrease")
		}
	}
	else
	{
		alert("请输入正确的商品数量");
		c.val(1);
	}
}
