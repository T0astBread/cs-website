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
if(isset($_GET["versionFrom"])) $versionFrom = convert_string_to_db_version_number($_GET["versionFrom"]);
if(isset($_GET["versionTo"])) $versionTo = convert_string_to_db_version_number($_GET["versionTo"]);
if(isset($_GET["dateFrom"])) $dateFrom = $_GET["dateFrom"];
if(isset($_GET["dateTo"])) $dateTo = $_GET["dateTo"];


$pathToRoot = "../";
include "templating/twig-environment.internal.php";


require_once "db/db.internal.php";

$stmt = $mysqli->prepare(
"SELECT DISTINCT news_articles.id, CAST(news_articles.product_version AS CHAR(12)), news_articles.date, news_article_localizations.title, news_article_localizations.text FROM news_articles, news_article_localizations, products, languages, authors
 WHERE products.name = ? AND news_articles.product_id = products.id
 AND languages.abbreviation = ? AND news_article_localizations.language_id = languages.id ".
 (isset($author) ? "AND authors.name = ? AND news_articles.author_id = authors.id " : "").
 (isset($versionFrom) ? "AND news_articles.product_version >= CAST(? AS UNSIGNED INTEGER)" : "").
 (isset($versionTo) ? "AND news_articles.product_version < CAST(? AS UNSIGNED INTEGER)" : "").
 (isset($dateFrom) ? "AND news_articles.date >= CAST(? AS DATE)" : "").
 (isset($dateTo) ? "AND news_articles.date < CAST(? AS DATE)" : "").
 (isset($query) ? "AND (news_article_localizations.title LIKE ? OR news_article_localizations.text LIKE ? OR news_articles.product_version LIKE ? OR news_articles.date LIKE ?)" : "").
"AND news_article_localizations.article_id = news_articles.id
 LIMIT ? OFFSET ?");

$params = ["ss", $product, $lang];

function push_optional($type, $val)
{
    global $params;
    $params[0] .= $type;
    array_push($params, $val);
}

function push_optional_s($val)
{
    push_optional("s", $val);
}

if(isset($author)) push_optional_s($author);
if(isset($versionFrom)) push_optional_s($versionFrom);
if(isset($versionTo)) push_optional_s($versionTo);
if(isset($dateFrom)) push_optional_s($dateFrom);
if(isset($dateTo)) push_optional_s($dateTo);

if(isset($query))
{
    $params[0] .= "ssss";
    $versionQuery = "%".convert_string_to_db_version_number($query)."%";
    $query = "%".$query."%";
    $params = array_merge($params, [$query, $query, $versionQuery, $query]);
}
$params[0] .= "ii";
$params = array_merge($params, [$limit, $offset]);
call_user_func_array([$stmt, "bind_param"], $params);

$stmt->execute();
$stmt->bind_result($id, $version, $date, $title, $text);
while($stmt->fetch())
{
    echo $twig->render("components/news-list-item.html.twig",
        ["id" => $id, "version" => convert_db_string_response_to_version_number($version), "date" => $date, "title" => $title, "textPreview" => $text]);
}

$stmt->close();
$mysqli->close();
?>