<?php
require_once "php/constants.internal.php";

$pathToRoot = "";
include "php/templating/page-renderer.internal.php";

echo render_page("pages/imprint.html.twig");
?>