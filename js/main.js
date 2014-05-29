window.onload = function(){
	window.oncontextmenu = noRightClick;
}

function noRightClick(){
	window.alert("no can do");
	return false;
}