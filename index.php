<?php include 'header.php' ?>
		<div id="countdown">
			
			<div class="load">
				<p id="seconds" style="color:rgba(0, 0, 0, 0);"><?php
					$result = mysqli_query($conn, "SELECT UNIX_TIMESTAMP(DATE_FORMAT(MIN(eventdate), '%Y-%c-%d %H:%i:%s')) - UNIX_TIMESTAMP(DATE_FORMAT(SYSDATE(), '%Y-%c-%d %H:%i:%s')) as next_event FROM event  WHERE eventdate > SYSDATE()");
					$secs = $result->fetch_object()->next_event;
					echo $secs;
				?>
				<div id="inner1">
					<script type="application/javascript">
						var myCountdown1 = new Countdown({
						 	time: document.getElementById('seconds').innerHTML, 
							width: document.width *.38, 
							height: document.width * .05,
							rangeHi:"month",
							style:"flip"
							});
					</script>
				</div>
				<h2> until <?php 
					$next_event = mysqli_query($conn, "SELECT eventname, MIN(eventdate) FROM event WHERE eventdate > SYSDATE()"); 
					echo $next_event->fetch_object()->eventname; ?>
				</h2>
			</div>
		</div>

		<div id="content1">
			<div id="overlay">
				<div class="load">
					<h1>¡HOLA!</h1>
					<p>We put content here. Textual content. We can put potato. PUT-tato. Get it? ba-dum-tss :]</p>
					<p>Nulla scelerisque. Sed tincidunt. Quisque eu nisl. Phasellus mi ante, aliquet vel, vestibulum sit amet, consectetuer non, ante. Suspendisse consequat condimentum enim. Morbi vestibulum lorem sit amet enim. Nulla venenatis fermentum purus.</p>
				   	<p>Nunc justo nisl, vulputate in, sagittis in, pretium sodales, magna. Nullam felis diam, bibendum ut, dictum in, tincidunt vitae, magna. Nunc mattis congue leo.</p>
				</div>
			</div>
		</div>

		<div id="content2">
			<div class="load scrollable">
				<h1><a href="events.php" style="color:white;">UPCOMING EVENTS</a></h1>
				<?php
					$sql = "SELECT eventname, DATE_FORMAT(eventdate, '%M %e, %Y') as next_event FROM event WHERE eventdate > SYSDATE() GROUP BY eventname ORDER BY eventdate";
					$result = mysqli_query($conn, $sql) or die("Connection Error" . mysqli_errno($conn));

					foreach($result as $event){
						echo 
						"<div class=\"event\">
							<h1>" . $event["eventname"] . "</h1>
							<h3>" . $event["next_event"] . " | ";
							$sql2 = "SELECT * FROM event WHERE eventname = \"" . $event["eventname"] . "\"";
							$boom = mysqli_query($conn, $sql2);
							foreach($boom as $distance){
								echo $distance["distance"] . "K ";
							}
						echo
							"</h3>
						</div>";
					}
				?>
			</div>
		</div>
<?php include 'footer.php' ?>