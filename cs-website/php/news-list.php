<?php
error_reporting(0);


require_once "utils.internal.php";

if(!isset($_GET["product"]) || !isset($_GET["limit"]) || !isset($_GET["offset"]) || !isset($_GET["lang"])) bad_request("You need to specify a product, limit, offset and a language!");
$product = $_GET["product"];
$limit = $_GET["limit"];
$offset = $_GET["offset"];
$lang = $_GET["lang"];

if(!is_numeric($limit)) bad_request("The limit must be a number!");
if($limit < 1) bad_request("At least one element must be requested! (0 < limit < 26)");
if($limit > 25) bad_request("You can only load a maximum of 25 elements per request! (0 < limit < 26)");

if(!is_numeric($offset)) bad_request("The offset must be a number!");
if($offset < 0) bad_request("The offset must be greater than or equal to 0!");

if(isset($_GET["author"])) $author = $_GET["author"];
if(isset($_GET["query"])) $query = $_GET["query"];


$pathToRoot = "../";
include "templating/twig-environment.internal.php";


require_once "db/db.internal.php";

$stmt = $mysqli->prepare(
"SELECT DISTINCT news_articles.id, news_article_localizations.title, news_article_localizations.text FROM news_articles, news_article_localizations, products, languages, authors
 WHERE products.name = ? AND news_articles.product_id = products.id
 AND languages.abbreviation = ? AND news_article_localizations.language_id = languages.id ".
 (isset($author) ? "AND authors.name = ? AND news_articles.author_id = authors.id " : "").
 (isset($query) ? "AND (news_article_localizations.title LIKE ? OR news_article_localizations.text LIKE ?)" : "").
"AND news_article_localizations.article_id = news_articles.id
 LIMIT ? OFFSET ?");
// $stmt->bind_param("ssii", $product, $lang, $limit, $offset);
$params = ["ss", $product, $lang];
if(isset($author))
{
    $params[0] .= "s";
    array_push($params, $author);
}
if(isset($query))
{
    $params[0] .= "ss";
    $query = "%".$query."%";
    $params = array_merge($params, [$query, $query]);
}
$params[0] .= "ii";
$params = array_merge($params, [$limit, $offset]);
call_user_func_array([$stmt, "bind_param"], $params);

$stmt->execute();
$stmt->bind_result($id, $title, $text);
while($stmt->fetch())
{
    echo $twig->render("components/news-list-item.html.twig", ["id" => $id, "title" => $title, "textPreview" => $text]);
}

$stmt->close();
$mysqli->close();

// for($i = 0; $i < $limit; $i++)
// {
//     echo $twig->render("components/news-list-item.html.twig", ["id" => 4, "title" => "Title", "textPreview" => "This is the text preview. This is the text preview. This is the text preview. This is the text preview. This is the text preview."]);
// }
?>