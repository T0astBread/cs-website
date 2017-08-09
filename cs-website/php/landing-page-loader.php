<?php
function is_landing_page_present()
{
    global $pathToRoot;
    return file_exists($pathToRoot."/landingpage/index.html");
}
?>