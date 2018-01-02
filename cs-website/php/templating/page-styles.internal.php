<?php
require_once $pathToRoot."php/constants.internal.php";
require_once $pathToRoot."php/templating/twig-environment.internal.php";

header("Content-type: text/css; charset: UTF-8");
echo $twig->render("resources/styles/".$pageName.".css.twig");
?>