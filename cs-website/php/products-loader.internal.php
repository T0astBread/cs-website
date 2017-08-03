<?php
function load_products()
{
    $products = [];

    include "db/db.internal.php";
    $results = $mysqli->query("SELECT name FROM products ORDER BY name");
    while($row = $results->fetch_assoc())
    {
        array_push($products, $row["name"]);
    }

    $results->close();
    $mysqli->close();
    return $products;
}
?>