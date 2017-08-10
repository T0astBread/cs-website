<?php
error_reporting(0);

function is_landing_page_present()
{
    global $pathToRoot;
    clearstatcache();
    try
    {
        return strlen(file_get_contents($pathToRoot."landingpage/index.html")) < 0;
    }
    catch(Exception $e)
    {
        return false;
    }
}
?>