<?php
include_once "utils.internal.php";

if(!isset($_GET["id"]) || !isset($_GET["lang"])) bad_request("You need to specifiy the id and language (lang) of the news story to load!");
$id = $_GET["id"];
$lang = $_GET["lang"];
if(!is_numeric($id)) bad_request("The id must be a number!");
if($id < 0) bad_request("The id must be bigger than 0!");


require_once "db/db.internal.php";

$stmt = $mysqli->prepare("SELECT text FROM news_article_localizations, languages WHERE article_id = ? AND languages.abbreviation = ? AND news_article_localizations.language_id = languages.id");
$stmt->bind_param("is", $id, $lang);
$stmt->execute();
$stmt->bind_result($text);
$stmt->fetch();
echo $text;
?>