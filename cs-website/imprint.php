<?php
require_once "php/constants.internal.php";

$pathToRoot = "";
include "php/templating/twig-environment.internal.php";

echo render("pages/imprint.html.twig");
?>