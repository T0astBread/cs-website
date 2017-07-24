<?php
include_once "utils.internal.php";

if(!isset($_GET["product"]) || !isset($_GET["limit"]) || !isset($_GET["offset"])) bad_request("You need to specify a product, limit and offset!");
$product = $_GET["product"];
$limit = $_GET["limit"];
$offset = $_GET["offset"];

if(!is_numeric($limit)) bad_request("The limit must be a number!");
if($limit < 1) bad_request("At least one element must be requested! (0 < limit < 26)");
if($limit > 25) bad_request("You can only load a maximum of 25 elements per request! (0 < limit < 26)");

if(!is_numeric($offset)) bad_request("The offset must be a number!");
if($offset < 0) bad_request("The offset must be greater than or equal to 0!");


$pathToRoot = "../";
include "templating/twig-environment.internal.php";

for($i = 0; $i < $limit; $i++)
{
    echo $twig->render("components/news-list-item.html.twig", ["id" => 4, "title" => "Title", "textPreview" => "This is the text preview. This is the text preview. This is the text preview. This is the text preview. This is the text preview."]);
}
?>