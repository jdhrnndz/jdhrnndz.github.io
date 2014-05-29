
	<html>
	<script type="text/javascript">
		var rev = "fwd";
		function titlebar(val){
			var msg;
			var res = " ";
			var speed = 50;
			var pos = val;
			msg = "Scurry! - Get in the know of latest marathon in the country!";
			var le = msg.length;
			if(rev == "bwd"){
				if(pos > 0){
					pos = pos-1;
					var ale = le-pos;
					scrol = msg.substr(ale,le);
					document.title = scrol;
					timer = window.setTimeout("titlebar("+pos+")",speed*2);
				}
				else{
					rev = "fwd";
					timer = window.setTimeout("titlebar("+pos+")",speed);
				}
			}
			else{
				if(pos < le){
					pos = pos+1;
					scroll = msg.substr(0,pos);
					document.title = scroll;
					timer = window.setTimeout("titlebar("+pos+")",speed);
				}
				else{
					rev = "bwd";
					timer = window.setTimeout("titlebar("+pos+")",speed);
				}
			}
		}
		titlebar(0);
		//src = "http://academyoftumblr.tumblr.com/post/10896016175/typing-moving-title-bar"
	</script>
	</html>