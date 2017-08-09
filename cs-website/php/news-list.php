<?php
// error_reporting(0);


require_once "utils.internal.php";

if(!isset($_GET["product"]) || !isset($_GET["limit"]) || !isset($_GET["offset"]) || !isset($_GET["lang"])) bad_request("You need to specify a product, limit, offset and a language!");
$product = $_GET["product"];
$limit = $_GET["limit"];
$offset = $_GET["offset"];
$lang = $_GET["lang"];

if(!is_numeric($limit)) bad_request("The limit must be a number!");
if($limit < 1) bad_request("At least one element must be requested! (0 < limit < 26)");
if($limit > 50) bad_request("You can only load a maximum of 50 elements per request! (0 < limit < 51)");

if(!is_numeric($offset)) bad_request("The offset must be a number!");
if($offset < 0) bad_request("The offset must be greater than or equal to 0!");

if(isset($_GET["author"])) $author = $_GET["author"];
if(isset($_GET["query"]))
{
    $query = $_GET["query"];
    $versionQuery = convert_string_to_db_version_number($query);
}
if(isset($_GET["versionFrom"])) $versionFrom = convert_string_to_db_version_number($_GET["versionFrom"]);
if(isset($_GET["versionTo"])) $versionTo = convert_string_to_db_version_number($_GET["versionTo"]);
if(isset($_GET["dateFrom"])) $dateFrom = $_GET["dateFrom"];
if(isset($_GET["dateTo"])) $dateTo = $_GET["dateTo"];


$pathToRoot = "../";
require_once "templating/twig-environment.internal.php";


require_once "db/db.internal.php";
$mysqli = build_mysqli();

if(isset($query))
{
    $versionQuery = "'%".$mysqli->real_escape_string(convert_string_to_db_version_number($query))."%'";
    $query = "'%".$mysqli->real_escape_string($query)."%'";
}

$actualLang = $lang; //Small trick to disable multilingual news
$lang = "de";

$sqlVersionCast = "CAST(news_articles.product_version AS CHAR(12))"; //This is ugly code, but I'm not aware of any workarounds in mysqli
$sqlQuery =
"SELECT DISTINCT news_articles.id, {$sqlVersionCast}, news_categories.uses_alternate_version_tagging, news_articles.date, news_article_localizations.title, news_article_localizations.text FROM news_articles, news_article_localizations, news_categories, languages, authors
 WHERE news_articles.active = '1'
 AND news_categories.name = '".$mysqli->real_escape_string($product)."' AND news_articles.category_id = news_categories.id
 AND languages.abbreviation = '".$mysqli->real_escape_string($lang)."' AND news_article_localizations.language_id = languages.id ".
 (isset($author) ? "AND authors.name = '".$mysqli->real_escape_string($author)."' AND news_articles.author_id = authors.id " : "").
 (isset($versionFrom) ? "AND news_articles.product_version >= CAST('".$mysqli->real_escape_string($versionFrom)."' AS UNSIGNED INTEGER)" : "").
 (isset($versionTo) ? "AND news_articles.product_version < CAST('".$mysqli->real_escape_string($versionTo)."' AS UNSIGNED INTEGER)" : "").
 (isset($dateFrom) ? "AND news_articles.date >= CAST('".$mysqli->real_escape_string($dateFrom)."' AS DATE)" : "").
 (isset($dateTo) ? "AND news_articles.date < CAST('".$mysqli->real_escape_string($dateTo)."' AS DATE)" : "").
 (isset($query) ? "AND (news_article_localizations.title LIKE {$query} OR news_article_localizations.text LIKE {$query} OR news_articles.product_version LIKE {$versionQuery} OR news_articles.date LIKE {$query})" : "").
"AND news_article_localizations.article_id = news_articles.id
 LIMIT ".$mysqli->real_escape_string($limit)." OFFSET ".$mysqli->real_escape_string($offset);

$lang = $actualLang;

$result = $mysqli->query($sqlQuery);
$listItems = [];
while($row = $result->fetch_assoc())
{
    array_push($listItems,
    [
        "id" => $row["id"],
        "version" => convert_db_string_response_to_version_number($row[$sqlVersionCast], $row["uses_alternate_version_tagging"]),
        "date" => $row["date"],
        "title" => $row["title"],
        "textPreview" => $row["text"]
    ]);
}
echo $twig->render("components/news-list-items.html.twig", ["items" => $listItems, "offset" => $offset]);

$result->close();
$mysqli->close();
?>