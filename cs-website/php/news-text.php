<?php
include_once "utils.internal.php";

if(!isset($_GET["id"])) bad_request("You need to specifiy the id of the news story to load!");
$id = $_GET["id"];
if(!is_numeric($id)) bad_request("The id must be a number!");
if($id < 0) bad_request("The id must be bigger than 0!");


echo "This is the news text for id ".$id;
?>