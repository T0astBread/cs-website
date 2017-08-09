<?php
require_once "php/constants.internal.php";

$pathToRoot = "";
require_once "php/templating/page-renderer.internal.php";

$_GET["product"] = "Allgemein";
$_GET["limit"] = 7;
$_GET["offset"] = 0;
if(!isset($_GET["lang"])) $_GET["lang"] = "de";
require_once "php/news-list.php";
echo render_page("pages/home.html.twig", ["newsListLoaded" => ob_get_clean()]);
?>