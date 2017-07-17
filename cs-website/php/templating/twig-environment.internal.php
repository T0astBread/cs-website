<?php
if(!isset($pathToRoot)) die("You need to set the variable pathToRoot before including this file!");
include $pathToRoot."vendor/autoload.php";

$loader = new Twig_Loader_Filesystem("templates/");
$loader->addPath("templates/components/");
$loader->addPath("templates/pages/");
$twig = new Twig_Environment($loader);
?>