<?php
require_once $pathToRoot."php/constants.internal.php";
require_once $pathToRoot."php/templating/page-renderer.internal.php";

function render_products_page($visiblePanel)
{
    return render_page("pages/products.html.twig", ["visiblePanel" => $visiblePanel]);
}
?>