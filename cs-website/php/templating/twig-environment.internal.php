<?php
include_once realpath(__DIR__)."/../utils.internal.php";

if(!isset($pathToRoot)) respond(510, "The variable pathToRoot must be set before including this file!");
include $pathToRoot."vendor/autoload.php";

$loader = new Twig_Loader_Filesystem($pathToRoot."templates/");
$loader->addPath($pathToRoot."templates/components/");
$loader->addPath($pathToRoot."templates/components/assembled-components");
$loader->addPath($pathToRoot."templates/pages/");

$identifierFilter = new Twig_SimpleFilter("identifier", function($string, $group = "")
{
    // $string = mb_convert_encoding($string, "iso-8859-1", "UTF-8");
    // $group = mb_convert_encoding($group, "iso-8859-1", "UTF-8");
    
    return mb_strtolower(($group !== "" ? $group."-" : "").str_replace(" ", "-", str_replace("Ä", "ae", str_replace("Ö", "oe", str_replace("Ü", "ue", mb_strtoupper($string))))));
});

$include = new Twig_Function("include", function($templateName, $variables)
{
    global $twig;
    return $twig->render($templateName, $variables);
});

$twig = new Twig_Environment($loader);
$twig->addFilter($identifierFilter);
$twig->addFunction($include);


$lang = isset($_GET["lang"]) ? $_GET["lang"] : "de";

$availableLangs = array_filter(scandir($pathToRoot."bundles/"), function($element)
{
    return pathinfo($element, PATHINFO_EXTENSION) === "bundle";
});
$availableLangs = array_map(function($element)
{
    return str_replace(".bundle", "", $element);
}, $availableLangs);
if(!in_array($lang, $availableLangs)) $lang = "de";

include $pathToRoot."php/lib/XBundle_Extension.php";
$bundleLoader = (new XBundle\Xbundle_Extension($pathToRoot."bundles/"))->loadBundle("{$lang}.bundle");
$twig->addExtension($bundleLoader);
?>