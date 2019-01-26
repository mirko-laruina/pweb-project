<?php
	if(isset($_GET['attr']) && isset($_GET['value']) && isset($_GET['user'])){
		$attr = $_GET['attr'];
		$value = $_GET['value'];
		$username = $_GET['user'];
		$mysqli = new mysqli('localhost', 'root', '', 'bouncethemall');
        if($mysqli->connect_error){
            die('Errore di connessione: '.$mysqli->connect_error);
        }
        $query = "UPDATE user_data SET $attr = $value WHERE username='$username'";
        $result = $mysqli->query($query);
        $mysqli->close();
	}
?>