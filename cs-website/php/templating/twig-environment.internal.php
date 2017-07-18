<?php
if(!isset($pathToRoot)) die("You need to set the variable pathToRoot before including this file!");
include $pathToRoot."vendor/autoload.php";

$loader = new Twig_Loader_Filesystem("templates/");
$loader->addPath("templates/components/");
$loader->addPath("templates/pages/");

$identifierFilter = new Twig_SimpleFilter("identifier", function($string, $group)
{
    $string = mb_convert_encoding($string, "iso-8859-1", "UTF-8");
    $group = mb_convert_encoding($group, "iso-8859-1", "UTF-8");
    return strtolower(($group !== "" ? $group."-" : "").str_replace(" ", "-", str_replace("Ä", "ae", str_replace("Ö", "oe", str_replace("Ü", "ue", strtoupper($string))))));
});

$twig = new Twig_Environment($loader);
$twig->addFilter($identifierFilter);
?>