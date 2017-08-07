<?php
require_once realpath(__DIR__)."/db/db.internal.php";

function get_jobs_count()
{
    $mysqli = build_mysqli();
    $queryResult = $mysqli->query("SELECT COUNT(news_articles.id) FROM news_articles, news_categories WHERE news_articles.active = '1' AND news_categories.name = 'Jobs' AND news_articles.category_id = news_categories.id");
    $result = $queryResult->fetch_assoc()["COUNT(news_articles.id)"];
    $queryResult->close();
    $mysqli->close();
    return $result;
}
?>