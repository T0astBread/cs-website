<?php
require_once "db-credentials.secure.internal.php";

function build_mysqli()
{
    global $host, $user, $password, $database, $port;
    $mysqli = new mysqli($host, $user, $password, $database, $port);
    $mysqli->set_charset("utf8");
    return $mysqli;
}
?>