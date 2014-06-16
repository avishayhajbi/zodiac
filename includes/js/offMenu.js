$(document).ready(function(){
	screenwidth();
});
function screenwidth(){
	var screenWidth = $(document).width()-50;
	var percentage = ( screenWidth * 100 ) / $(document).width() ; // 0.92%
	return percentage;
}
$(function() {
    $('.toggle-nav-left').click(function() {
        // Calling a function in case you want to expand upon this.
        toggleNav_Left();
    });
});
function toggleNav_Left() {
    if ($('#site-wrapper').hasClass('show-nav-left')) {
    	$("section#site-canvas").css('border-left',"none");
        $('#site-wrapper.show-nav-left #site-canvas').css({"-webkit-transform":"translateX(0)"});
        $('#site-wrapper.show-nav-left #site-canvas').css({"transform":"translateX(0)"});
        $('#site-wrapper').removeClass('show-nav-left');
    } else {
        // Do things on Nav Open
        $('#site-wrapper').addClass('show-nav-left');
        $("section#site-canvas").css('border-left',"1px solid black");
        $('#site-wrapper.show-nav-left #site-canvas').css({"-webkit-transform":"translateX("+screenwidth()+"%)"});
        $('#site-wrapper.show-nav-left #site-canvas').css({"transform":"translateX("+screenwidth()+"%)"});
    }
}
$(function() {
    $('.toggle-nav-right').click(function() {
        // Calling a function in case you want to expand upon this.
        toggleNav_right();
    });
});
function toggleNav_right() {
    if ($('#site-wrapper').hasClass('show-nav-right')) {
    	$("section#site-canvas").css('border-right',"none");
        $('#site-wrapper.show-nav-right #site-canvas').css({"-webkit-transform":"translateX(0)"});
      	$('#site-wrapper.show-nav-right #site-canvas').css({"transform":"translateX(0)"});
        $('#site-wrapper').removeClass('show-nav-right');
    } else {
        // Do things on Nav Open
        $('#site-wrapper').addClass('show-nav-right');
        $("section#site-canvas").css('border-right',"1px solid black");
        $('#site-wrapper.show-nav-right #site-canvas').css({"-webkit-transform":"translateX("+-screenwidth()+"%)"});
      	$('#site-wrapper.show-nav-right #site-canvas').css({"transform":"translateX("+-screenwidth()+"%)"});
    }
}