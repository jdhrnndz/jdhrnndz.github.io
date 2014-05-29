<?php include 'header.php' ?>
	<div id="upcoming-events">
		<div class="load scrollable">
			<h1>UPCOMING EVENTS</h1>
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
	<div id="past-events">
		<div class="load scrollable">
			<h1>PAST EVENTS</h1>
			<?php
				$sql = "SELECT eventname, DATE_FORMAT(eventdate, '%M %e, %Y') as next_event FROM event WHERE eventdate < SYSDATE() GROUP BY eventname ORDER BY eventdate";
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