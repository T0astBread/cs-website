<?php
ob_start();

require_once "php/constants.internal.php";

$pathToRoot = "";
require_once "php/templating/page-renderer.internal.php";

$_GET["product"] = "CS-Transport V6";
$_GET["limit"] = 50;
$_GET["offset"] = 0;
if(!isset($_GET["lang"])) $_GET["lang"] = "de";
require_once "php/news-list.php";
$newsLoaded = ob_get_clean();


require_once "php/landing-page-loader.php";
$landingPagePresent = is_landing_page_present();


echo render_page("pages/home.html.twig", ["selectedProduct" => $_GET["product"], "newsListLoaded" => $newsLoaded, "showOverlay" => $landingPagePresent]);
?>