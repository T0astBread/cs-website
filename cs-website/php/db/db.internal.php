<?php
require_once "db-credentials.secure.internal.php";

$mysqli = new mysqli($host, $user, $password, $database);
$mysqli->set_charset("utf8");
?>