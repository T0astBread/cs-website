<?php
require_once "db-credentials.secure.internal.php";

$mysqli = new mysqli($host, $user, $password, $database, $port);
$mysqli->set_charset("utf8");
?>