$("#acronym > .acro").hover(
	function() {
		$("."+$(this).attr('class').split(' ')[0]).addClass("selected");
	},
	function() {
		$(".acro."+$(this).attr('class').split(' ')[0]).removeClass("selected");
	}
);