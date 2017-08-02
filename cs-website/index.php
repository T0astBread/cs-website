<?php
include "php/constants.internal.php";

$pathToRoot = "";
include "php/templating/twig-environment.internal.php";

echo $twig->render("pages/home.html.twig", ["langs" => $availableLangs, "lang" => $lang]);
?>