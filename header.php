<!DOCTYPE html>

<html lang="en">
	<head>
		<meta charset=utf-8>

		<title>Scurry! - Get in the know of latest marathon in the country.</title>
		<link rel="stylesheet" href="css/reset.css"/>
		<link rel="stylesheet" href="css/main.css"/>
		<link rel="stylesheet" href="css/mozilla-custom.css"/>
		<link rel="shortcut icon" href="res/scurry logo.ico"/>
		<script src="js/countdown.js" type="text/javascript"></script>
		<script src="js/main.js" type="text/javascript"></script>
		<?php 
			include 'marquee-bar.php';
			$conn = mysqli_connect("localhost", "root", "", "marathon") or die("Connection Error");
		?>
	</head>

	<body onresize="reload();">
		<script>function reload(){
			var index = new RegExp("index.php");
			if(index.test(document.URL))
				location.reload();
		}</script>
		<nav>
			<ul id="navbar">	
				<li class="navlist" id="brand">Scurry!</li>
				<li class="navlist"><a href="index.php">HOME</a></li>
				<li class="navlist separator"></li>
				<li class="navlist"><a href="registration.php">REGISTER NOW</a></li>
				<li class="navlist separator"></li>
				<li class="navlist"><a href="events.php">EVENTS</a></li>
				<li class="navlist separator"></li>
				<li class="navlist"><a href="about.php">ABOUT</a></li>
				<li class="navlist separator"></li>
				<li class="navlist"><a href="contact-us.php">CONTACT US</a></li>
			</ul>
		</nav>