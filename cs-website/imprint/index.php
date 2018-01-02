<?php
$pathToRoot = "../";

require_once $pathToRoot."php/constants.internal.php";
include $pathToRoot."php/templating/page-renderer.internal.php";

echo render_page("pages/imprint.html.twig");
?>