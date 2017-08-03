<?php
include "php/constants.internal.php";

$pathToRoot = "";
include "php/templating/twig-environment.internal.php";

require_once "php/products-loader.internal.php";
echo render("pages/home.html.twig", ["products" => load_products()]);
?>