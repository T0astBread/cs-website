<?php
require_once "db/db.internal.php";

function load_products()
{
    $products = [];

    $mysqli = build_mysqli();
    $results = $mysqli->query("SELECT name FROM news_categories ORDER BY order_position, name");
    while($row = $results->fetch_assoc())
    {
        array_push($products, $row["name"]);
    }

    $results->close();
    $mysqli->close();
    return $products;
}
?>