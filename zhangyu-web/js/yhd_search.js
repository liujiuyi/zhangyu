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
        if (b == 99) {
            return
        } else {
            if (b == 98) {
                $(d).attr("class", "dis_add")
            } else {
                $(d).next().attr("class", "decrease")
            }
            c.val(b + a)
        }
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
