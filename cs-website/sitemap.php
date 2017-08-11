<?php
require_once "php/constants.internal.php";

$pathToRoot = "";
require_once "php/templating/twig-environment.internal.php";

echo $twig->render("sitemap.xml.twig");
?>